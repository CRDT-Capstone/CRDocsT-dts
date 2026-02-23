// Adapted from https://github.com/mweidner037/fugue/blob/main/fugue-max-simple/src/index.ts
export type NodeSide = "L" | "R";

/**
 * Lamport type identifier containing the sender replica id
 * and a counter
 */
export type ID = {
    sender: string;
    counter: number;
};

/**
 * Represents a node in a FTree. Each node corresponds to a character in the document, with a:
 * - unique ID that identifies the node and allows it to be referenced by other nodes (e.g. for insertions to the right of it).
 * - character value (null for the root node and deleted nodes)
 * - boolean isDeleted indicating whether the character has been deleted
 * - parent pointer to the node's parent (null for the root)
 * - side indicating whether the node is a left or right child of its parent (the root is considered a right child)
 * - leftChildren and rightChildren arrays containing the node's children on each side, sorted in the order they were inserted (with ties broken by sender ID)
 * - size of the subtree rooted at this node, counting only non-deleted nodes, for performance of index-based operations
 * - rightOrigin pointer to the node to the right of which this node was inserted, if any (null if inserted at the end of its siblings, undefined if not yet set)
 */
export interface FNode {
    id: ID;
    value: string | null;
    isDeleted: boolean;
    parent: FNode | null;
    side: NodeSide;
    leftChildren: FNode[];
    rightChildren: FNode[];
    size: number;
    rightOrigin?: FNode | null;
}

/**
 * Serializable version of FNode used for saving/loading. Pointers to other nodes are replaced with IDs,
 * and children arrays are omitted since they can be reconstructed from parent and rightOrigin pointers.
 */
export interface FNodeSave {
    value: string | null;
    isDeleted: boolean;
    parent: ID | null;
    side: NodeSide;
    size: number;
    rightOrigin?: ID | null;
}

/**
 * FTree is a CRDT for collaborative text editing. It represents the document as a tree of nodes,
 * where each node corresponds to a character. The tree structure encodes the relative ordering
 * of characters, and each node has a unique ID that allows it to be referenced by other nodes.
 * The tree supports insertions and deletions of characters, and can be traversed in order to reconstruct the document text.
 *
 */
export class FTree {
    // The root node is a special dummy node that serves as the parent of all top-level nodes.
    // It does not correspond to any character and is always considered deleted.
    readonly root: FNode;

    // Map from sender ID to an array of nodes created by that sender, indexed by counter. This allows for efficient lookup of nodes by ID.
    private readonly nodes = new Map<string, FNode[]>();

    constructor() {
        this.root = {
            id: { sender: "", counter: 0 },
            value: null,
            isDeleted: true,
            parent: null,
            side: "R",
            leftChildren: [],
            rightChildren: [],
            size: 0,
        };
        this.nodes.set("", [this.root]);
    }

    /**
     * Get the node with the given ID. Throws an error if no such node exists.
     * @param id - the ID of the node to retrieve
     * @returns  the node with the given ID
     */
    getByID(id: ID): FNode {
        const sender = this.nodes.get(id.sender);
        if (sender !== undefined) {
            const node = sender[id.counter];
            if (node !== undefined) return node;
        }
        throw new Error(`Unknown ID ${JSON.stringify(id)}`);
    }

    /**
     * Add a node to the tree with the given ID, value, parent, side, and optional rightOrigin.
     * The node is inserted among its siblings according to the order defined by rightOrigin and sender ID,
     * and the size of all ancestors is updated accordingly.
     * @param id - the ID of the new node
     * @param value - the character value of the new node
     * @param parent - the parent node of the new node
     * @param side - the side (left or right) of the new node with respect to its parent
     * @param rightOriginID - the ID of the node to the right of which the new node was inserted, or null if inserted at the end of its siblings (optional)
     */
    addNode(id: ID, value: string, parent: FNode, side: NodeSide, rightOriginID?: ID | null): void {
        const node: FNode = {
            id,
            value,
            isDeleted: false,
            parent,
            side,
            leftChildren: [],
            rightChildren: [],
            size: 0,
        };

        // If a rightOriginID is present we set the rightOrigin pointer.
        // We require that rightOrigin is already in the tree, since it
        // must be a sibling of the new node and thus must have been inserted before it.
        if (rightOriginID !== undefined) {
            node.rightOrigin = rightOriginID === null ? null : this.getByID(rightOriginID);
        }

        // Add node to nodesByID for lookup by ID.
        let sender = this.nodes.get(id.sender);
        if (!sender) {
            sender = [];
            this.nodes.set(id.sender, sender);
        }
        sender.push(node);

        // Insert node into siblings and update sizes of ancestors.
        this.insertIntoSiblings(node);

        this.updateSize(node, 1);
    }

    /**
     * TODO: Maybe change the children types to linked list to make insertions more efficient, since we expect many insertions at the end of the siblings.
     * Inserts a node into the correct position among its parent node's children arrays based on the
     * node's rightOrigin and sender ID, and the existing order of its rightOrigin among its siblings.
     * @param node - The node to insert into its siblings
     */
    private insertIntoSiblings(node: FNode) {
        // Insert node among its same-side siblings.
        const p = node.parent!;
        if (node.side === "R") {
            const right = p.rightChildren;
            // We want to insert node in the rightChildren array so that it is after all nodes that are less than
            // node according to the following order:
            // - If a and b have different rightOrigins, the one with the lesser rightOrigin goes first with null < any node.
            // - If a ad b have the same rightOrigin, the one with the lesser sender ID goes first
            let i = 0;
            for (; i < right.length; i++) {
                const sib = right[i];
                const isLessThanSib = this.isLess(node.rightOrigin!, sib.rightOrigin!);
                const isEqualRightOrigin = node.rightOrigin === sib.rightOrigin;
                const isGreaterSender = node.id.sender > sib.id.sender;
                if (!(isLessThanSib || (isEqualRightOrigin && isGreaterSender))) break;
            }
            right.splice(i, 0, node);
        } else {
            const left = p.leftChildren;
            // We want to insert node in the leftChildren array so that it is after all nodes that are have a lexographically
            // less sender ID, since all nodes in the leftChildren array have the same rightOrigin (the parent node).
            let i = 0;
            for (; i < left.length; i++) {
                if (!(node.id.sender.localeCompare(left[i].id.sender) > 0)) break;
            }
            left.splice(i, 0, node);
        }
    }

    /**
     * Determines whether node a should come before node b in the document order, based on their rightOrigin and sender ID.
     * returns true if a should come before b, false otherwise. i.e. a < b
     * @param a - the first node to compare
     * @param b - the second node to compare
     */
    private isLess(a: FNode | null, b: FNode | null): boolean {
        if (a === b) return false;
        if (a === null) return false;
        if (b === null) return true;

        // Walk one node up the tree until they are both the same depth.
        const aDepth = this.depth(a);
        const bDepth = this.depth(b);
        let aAn = a;
        let bAn = b;
        if (aDepth > bDepth) {
            let lastSide: NodeSide;
            for (let i = aDepth; i > bDepth; i--) {
                lastSide = aAn.side;
                aAn = aAn.parent!;
            }
            if (aAn === b) {
                // a is a descendant of b on lastSide.
                return lastSide! === "L";
            }
        }
        if (bDepth > aDepth) {
            let lastSide: NodeSide;
            for (let i = bDepth; i > aDepth; i--) {
                lastSide = bAn.side;
                bAn = bAn.parent!;
            }
            if (bAn === a) {
                // b is a descendant of a on lastSide.
                return lastSide! === "R";
            }
        }

        // Walk both nodes up the tree until we find a common ancestor.
        while (aAn.parent !== bAn.parent) {
            // If we reach the root, the loop will terminate, so both parents
            // are non-null here.
            aAn = aAn.parent!;
            bAn = bAn.parent!;
        }
        // Now aAn and bAn are distinct siblings. See how they are sorted
        // in their parent's child arrays.
        if (aAn.side !== bAn.side) return aAn.side === "L";
        else {
            const siblings = aAn.side === "L" ? aAn.parent!.leftChildren : aAn.parent!.rightChildren;
            return siblings.indexOf(aAn) < siblings.indexOf(bAn);
        }
    }

    /**
     * Find the depth of a node in the tree, defined as the number of edges from the node to the root. The root has depth 0.
     * @param node - the node whose depth to calculate
     * @returns the depth of the node in the tree
     */
    depth(node: FNode): number {
        let d = 0;
        let n = node;
        while (n.parent !== null) {
            d++;
            n = n.parent;
        }
        return d;
    }

    /**
     * Update the size of a node and all its ancestors by adding delta.
     * This should be called whenever a node is inserted or deleted to keep the size values accurate.
     * @param node - the node whose size and ancestors' sizes to update
     * @param delta - the amount to add to the size of the node and its ancestors (positive for insertions, negative for deletions)
     */
    updateSize(node: FNode, delta: number): void {
        let an: FNode | null = node;
        while (an !== null) {
            an.size += delta;
            an = an.parent;
        }
    }

    /**
     * Get the node by index from a starting node, i.e. the node corresponding to the index-th non-deleted
     * character in the subtree rooted at the starting node, where indices are 0-based.
     * @param node - node to start the search from (e.g. the root for document-level indexing)
     * @param index - the index of the node to retrieve among the non-deleted nodes in the subtree rooted at the starting node
     * @returns the node corresponding to the index-th non-deleted character in the subtree rooted at the starting node
     */
    getByIndex(node: FNode, index: number): FNode {
        if (index < 0 || index >= node.size) {
            throw new Error(`Index out of bounds: ${index}`);
        }

        // Inorder traversal of the subtree, but using the size values to skip over deleted nodes and entire subtrees that are before the index.
        let rem = index;
        rec: while (true) {
            for (const child of node.leftChildren) {
                if (rem < child.size) {
                    node = child;
                    continue rec;
                }
                rem -= child.size;
            }

            if (!node.isDeleted) {
                // If the current node is not deleted and rem is 0, we are at the node we want
                // otherwise keep traversing, decrementing rem by 1 to account for the current node.
                if (rem === 0) return node;
                rem--;
            }

            for (const child of node.rightChildren) {
                if (rem < child.size) {
                    node = child;
                    continue rec;
                }
                rem -= child.size;
            }
            throw new Error("Index in range but not found");
        }
    }

    /**
     * Get the index of a node disregarding the deleted nodes starting from the root
     * @param node - the node whose index to calculate among the non-deleted nodes in the subtree rooted at the root
     * @returns the index of the node among the non-deleted nodes in the subtree rooted at the root
     */
    getVisibleIndex(node: FNode): number {
        let index = 0;

        // Add the size of all visible nodes in our own left-side subtrees
        // since they come before us in the document (inorder) order.
        for (const left of node.leftChildren) {
            index += left.size;
        }

        let curr = node;
        while (curr.parent !== null) {
            const parent = curr.parent;
            if (curr.side === "R") {
                // If we are on the right side of our parent:
                // Everything in parent's leftChildren is before us
                for (const left of parent.leftChildren) index += left.size;
                // The parent itself is before us (if not deleted)
                if (!parent.isDeleted) index += 1;
                // Every right-sibling that is to our left in the array is before us
                const sibIdx = parent.rightChildren.indexOf(curr);
                for (let i = 0; i < sibIdx; i++) {
                    index += parent.rightChildren[i].size;
                }
            } else {
                // If we are on the left side of our parent:
                // Only siblings to our left in the leftChildren array are before us
                const sibIdx = parent.leftChildren.indexOf(curr);
                for (let i = 0; i < sibIdx; i++) {
                    index += parent.leftChildren[i].size;
                }
            }
            curr = parent;
        }
        return index;
    }

    /**
     * Get the leftmost descendant of a node, i.e. the node corresponding to the first non-deleted character in the subtree
     * rooted at the given node in document order.
     * @param node - the node whose leftmost descendant to find
     * @returns the leftmost descendant of the given node
     */
    leftmostDescendant(node: FNode): FNode {
        let desc = node;
        while (desc.leftChildren.length !== 0) desc = desc.leftChildren[0];
        return desc;
    }

    /**
     * Get the next non-descendant of a node, i.e. the node corresponding to the next non-deleted character in document order
     * that is not in the subtree rooted at the given node.
     * @param node - the node whose next non-descendant to find
     * @returns the next non-descendant of the given node, or null if there is no such node (i.e. the given node is the last non-deleted character in document order)
     */
    nextNonDescendant(node: FNode): FNode | null {
        let current = node;
        while (current.parent !== null) {
            const siblings = current.side === "L" ? current.parent.leftChildren : current.parent.rightChildren;
            const index = siblings.indexOf(current);
            if (index < siblings.length - 1) {
                // The next sibling's subtree immediately follows current's subtree.
                // Find its leftmost element.
                const nextSibling = siblings[index + 1];
                return this.leftmostDescendant(nextSibling);
            } else if (current.side === "L") {
                // The parent immediately follows current's subtree.
                return current.parent;
            }
            current = current.parent;
        }
        // We've reached the root without finding any further-right subtrees.
        return null;
    }

    /**
     * Traverse the subtree rooted at a node in document order, yielding the value of each non-deleted node.
     * @param node - the node to traverse from
     */
    *traverse(node: FNode): IterableIterator<string> {
        let current = node;
        // Stack records the next child to visit for that node.
        // We don't need to store node because we can infer it from the
        // current node's parent etc.
        const S: { side: NodeSide; childIndex: number }[] = [{ side: "L", childIndex: 0 }];
        while (true) {
            const top = S[S.length - 1];
            const children = top.side === "L" ? current.leftChildren : current.rightChildren;
            if (top.childIndex === children.length) {
                // We are done with the children on top.side.
                if (top.side === "L") {
                    // Visit current, then move to right children.
                    if (!current.isDeleted) yield current.value!;
                    top.side = "R";
                    top.childIndex = 0;
                } else {
                    // Go to the parent.
                    if (current.parent === null) return;
                    current = current.parent;
                    S.pop();
                }
            } else {
                const child = children[top.childIndex];
                // Save for later that we need to visit the next child.
                top.childIndex++;
                if (child.size > 0) {
                    // Traverse child.
                    current = child;
                    S.push({ side: "L", childIndex: 0 });
                }
            }
        }
    }

    /**
     * Serialize the tree into a Uint8Array. The tree is converted into a JSON object where each node is
     * represented by its value, isDeleted flag, parent ID, side, size, and rightOrigin ID (if applicable).
     * The JSON object is then converted to a string and encoded as a Uint8Array for storage or transmission.
     * @returns a Uint8Array containing the serialized tree data
     */
    save(): Uint8Array {
        // Convert nodesByID into JSON format, also converting each Node into a NodeSave.
        const save: { [sender: string]: FNodeSave[] } = {};
        for (const [sender, bySender] of this.nodes) {
            save[sender] = bySender.map((node) => {
                const nodeSave: FNodeSave = {
                    value: node.value,
                    isDeleted: node.isDeleted,
                    parent: node.parent === null ? null : node.parent.id,
                    side: node.side,
                    size: node.size,
                };
                if (node.rightOrigin !== undefined) {
                    nodeSave.rightOrigin = node.rightOrigin === null ? null : node.rightOrigin.id;
                }
                return nodeSave;
            });
        }
        return new TextEncoder().encode(JSON.stringify(save)); //allows us to encode from the frontend
    }

    /**
     * Load the tree from a Uint8Array containing serialized tree data in the format produced by the save() method.
     * The data is parsed from JSON format, and the tree is reconstructed by first creating all nodes without setting their parent or rightOrigin pointers,
     * then filling in the parent and rightOrigin pointers, and finally calling insertIntoSiblings on each node to reconstruct the children arrays.
     * @param saveData - a Uint8Array containing the serialized tree data to load
     */
    load(saveData: Uint8Array) {
        const save: { [sender: string]: FNodeSave[] } = JSON.parse(new TextDecoder().decode(saveData));
        // First create all nodes without pointers to other nodes (parent, children,
        // rightOrigin).
        for (const [sender, bySenderSave] of Object.entries(save)) {
            if (sender === "") {
                // Root node. Just set its size.
                this.root.size = bySenderSave[0].size;
                continue;
            }
            this.nodes.set(
                sender,
                bySenderSave.map((nodeSave, counter) => ({
                    id: { sender, counter },
                    parent: null,
                    value: nodeSave.value,
                    isDeleted: nodeSave.isDeleted,
                    side: nodeSave.side,
                    size: nodeSave.size,
                    leftChildren: [],
                    rightChildren: [],
                })),
            );
        }
        // Next, fill in the parent and rightOrigin pointers.
        for (const [sender, bySender] of this.nodes) {
            if (sender === "") continue;
            const bySenderSave = save[sender]!;
            for (let i = 0; i < bySender.length; i++) {
                const node = bySender[i];
                const nodeSave = bySenderSave[i];
                if (nodeSave.parent !== null) {
                    node.parent = this.getByID(nodeSave.parent);
                }
                if (nodeSave.rightOrigin !== undefined) {
                    node.rightOrigin = nodeSave.rightOrigin === null ? null : this.getByID(nodeSave.rightOrigin);
                }
            }
        }

        // Finally, call insertIntoSiblings on each node to fill in the children
        // arrays.
        // We must be careful to wait until after doing so for node.rightOrigin
        // and its ancestors, since insertIntoSiblings references the existing list order
        // on node.rightOrigin.

        // Nodes go from "pending" -> "ready" (rightOrigin valid) ->
        // "valid" (insertIntoSiblings called).
        // readyNodes is a stack; pendingNodes maps from a node to its dependencies.
        const readyNodes: FNode[] = [];
        const pendingNodes = new Map<FNode, FNode[]>();
        for (const [sender, bySender] of this.nodes) {
            if (sender === "") continue;
            for (let i = 0; i < bySender.length; i++) {
                const node = bySender[i];
                if (node.rightOrigin === undefined || node.rightOrigin === null) {
                    // rightOrigin not used or is the root; node is ready.
                    readyNodes.push(node);
                } else {
                    let pendingArr = pendingNodes.get(node.rightOrigin);
                    if (pendingArr === undefined) {
                        pendingArr = [];
                        pendingNodes.set(node.rightOrigin, pendingArr);
                    }
                    pendingArr.push(node);
                }
            }
        }

        while (readyNodes.length !== 0) {
            const node = readyNodes.pop()!;
            this.insertIntoSiblings(node);
            // node's dependencies are now ready.
            const deps = pendingNodes.get(node);
            if (deps !== undefined) readyNodes.push(...deps);
            pendingNodes.delete(node);
        }
        if (pendingNodes.size !== 0) {
            throw new Error("Failed to validate all nodes");
        }
    }


    getNodes(){
        return this.nodes;
    }
}
