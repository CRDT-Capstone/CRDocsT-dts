// Adapted from https://github.com/mweidner037/fugue/blob/main/fugue-max-simple/src/index.ts
export type NodeSide = "L" | "R";

export type ID = {
    sender: string;
    counter: number;
};

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
    readonly root: FNode;

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

    getByID(id: ID): FNode {
        const sender = this.nodes.get(id.sender);
        if (sender !== undefined) {
            const node = sender[id.counter];
            if (node !== undefined) return node;
        }
        throw new Error(`Unknown ID ${JSON.stringify(id)}`);
    }

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

        if (rightOriginID !== undefined) {
            node.rightOrigin = rightOriginID === null ? null : this.getByID(rightOriginID);
        }

        let sender = this.nodes.get(id.sender);
        if (!sender) {
            sender = [];
            this.nodes.set(id.sender, sender);
        }
        sender.push(node);

        this.insertIntoSiblings(node);

        this.updateSize(node, 1);
    }

    private insertIntoSiblings(node: FNode) {
        // Insert node among its same-side siblings.
        const parent = node.parent!;
        if (node.side === "R") {
            const rightSibs = parent.rightChildren;
            let i = 0;
            for (; i < rightSibs.length; i++) {
                if (
                    !(
                        this.isLess(node.rightOrigin!, rightSibs[i].rightOrigin!) ||
                        (node.rightOrigin === rightSibs[i].rightOrigin && node.id.sender > rightSibs[i].id.sender)
                    )
                )
                    break;
            }
            rightSibs.splice(i, 0, node);
        } else {
            const leftSibs = parent.leftChildren;
            // Siblings are sorted in lexicographic order by id.sender.
            let i = 0;
            for (; i < leftSibs.length; i++) {
                if (!(node.id.sender > leftSibs[i].id.sender)) break;
            }
            leftSibs.splice(i, 0, node);
        }
    }

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

    depth(node: FNode): number {
        let depth = 0;
        for (let current = node; current.parent !== null; current = current.parent) {
            depth++;
        }
        return depth;
    }

    updateSize(node: FNode, delta: number): void {
        for (let an: FNode | null = node; an !== null; an = an.parent) {
            an.size += delta;
        }
    }

    getByIndex(node: FNode, index: number): FNode {
        if (index < 0 || index >= node.size) {
            throw new Error(`Index out of bounds: ${index}`);
        }

        let remaining = index;
        rec: while (true) {
            for (const child of node.leftChildren) {
                if (remaining < child.size) {
                    node = child;
                    continue rec;
                }
                remaining -= child.size;
            }
            if (!node.isDeleted) {
                if (remaining === 0) return node;
                remaining--;
            }
            for (const child of node.rightChildren) {
                if (remaining < child.size) {
                    node = child;
                    continue rec;
                }
                remaining -= child.size;
            }
            throw new Error("Index in range but not found");
        }
    }

    getVisibleIndex(node: FNode): number {
        let index = 0;

        // Add the size of all visible nodes in our own left-side subtrees
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
                // Every right-sibling that is to our "left" in the array is before us
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

    leftmostDescendant(node: FNode): FNode {
        let desc = node;
        for (; desc.leftChildren.length !== 0; desc = desc.leftChildren[0]) {}
        return desc;
    }

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

    *traverse(node: FNode): IterableIterator<string> {
        let current = node;
        // Stack records the next child to visit for that node.
        // We don't need to store node because we can infer it from the
        // current node's parent etc.
        const stack: { side: NodeSide; childIndex: number }[] = [{ side: "L", childIndex: 0 }];
        while (true) {
            const top = stack[stack.length - 1];
            const children = top.side === "L" ? current.leftChildren : current.rightChildren;
            if (top.childIndex === children.length) {
                // We are done with the children on top.side.
                if (top.side === "L") {
                    // Visit us, then move to right children.
                    if (!current.isDeleted) yield current.value!;
                    top.side = "R";
                    top.childIndex = 0;
                } else {
                    // Go to the parent.
                    if (current.parent === null) return;
                    current = current.parent;
                    stack.pop();
                }
            } else {
                const child = children[top.childIndex];
                // Save for later that we need to visit the next child.
                top.childIndex++;
                if (child.size > 0) {
                    // Traverse child.
                    current = child;
                    stack.push({ side: "L", childIndex: 0 });
                }
            }
        }
    }

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
        return new Uint8Array(Buffer.from(JSON.stringify(save)));
    }

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
            throw new Error("Internal error: failed to validate all nodes");
        }
    }
}
