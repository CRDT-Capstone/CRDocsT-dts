import { allChildIds, AstNode, BragiAST, NodeId } from "../../types/index.js";
import { MappingStore, Mapping } from "../../types/GumTree.js";
import { preoderAstTraversal, preorderAstTraversalIterator } from "../../utils.js";
import { EditScript, EditScriptGen } from "./EditScriptGen.js";
import { Delete, Insert, Move, Update } from "../Model/index.js";
import { v4 as uuidv4 } from "uuid";

/**
 * ChawatheScriptGen implements the edit script generation algorthm described in "Change Detection in Hierarchically Structured Information" by Chawathe et al.
 * based on the implementation described in "GumTree: Fast and Accurate Tree Differencing" by Falleri et al, and the original ChawatheScriptGenerator implementation in Java
 * (https://github.com/GumTreeDiff/gumtree/blob/main/core/src/main/java/com/github/gumtreediff/actions/ChawatheScriptGenerator.java).
 *
 * This algorthm is a top-down, left-to-right traversal of the destination tree, generating insertions and moves/updates as it goes,
 * followed by a bottom-up traversal of the source tree to generate deletions.
 */
export class ChawatheScriptGen implements EditScriptGen {
    // Initialize with empty ASTs and mappings, these will be populated in init() before generate() is called.
    ogOldAst: BragiAST = { rootId: "", nodes: new Map() };
    cpyOldAst: BragiAST = { rootId: "", nodes: new Map() };
    ogNewAst: BragiAST = { rootId: "", nodes: new Map() };
    cpyNewAst: BragiAST = { rootId: "", nodes: new Map() };
    ogMappings: MappingStore = new MappingStore({ rootId: "", nodes: new Map() }, { rootId: "", nodes: new Map() });
    cpyMappings: MappingStore = new MappingStore({ rootId: "", nodes: new Map() }, { rootId: "", nodes: new Map() });
    newInOrder: Map<NodeId, AstNode> = new Map();
    oldInOrder: Map<NodeId, AstNode> = new Map();
    actions: EditScript = [];
    ogToCpyIdMap: Map<NodeId, NodeId> = new Map();
    cpyToOgIdMap: Map<NodeId, NodeId> = new Map();
    ogNodeMap: Map<NodeId, AstNode> = new Map();
    cpyNodeMap: Map<NodeId, AstNode> = new Map();

    constructor() {}

    /**
     * Resets the copy of the old AST and all related mappings to their initial state based on the original old AST and mappings.
     */
    private resetCpy() {
        this.cpyOldAst = structuredClone(this.ogOldAst);

        this.ogToCpyIdMap = new Map();
        this.cpyToOgIdMap = new Map();

        const cpyItr = preorderAstTraversalIterator(this.cpyOldAst);
        for (const ogNode of preoderAstTraversal(this.ogOldAst)) {
            const { value: cpyNode, done } = cpyItr.next();
            if (done || !cpyNode) break;
            this.ogToCpyIdMap.set(ogNode.id, cpyNode.id);
            this.cpyToOgIdMap.set(cpyNode.id, ogNode.id);
        }

        this.cpyMappings = new MappingStore(this.cpyOldAst, this.ogNewAst);
        for (const mapping of this.ogMappings) {
            const cpyId = this.ogToCpyIdMap.get(mapping.f);
            if (cpyId !== undefined) this.cpyMappings.addMapping(cpyId, mapping.s);
        }
    }

    /**
     * Initializes the ChawatheScriptGen with the original old and new ASTs and their mappings. This method must be called before generate() to set up the internal state of the generator.
     * @param m - The original mappings between the old and new ASTs.
     */
    init(m: MappingStore) {
        this.ogOldAst = m.oldAst;
        this.ogNewAst = m.newAst;
        this.ogMappings = m;

        this.resetCpy();
    }

    /**
     * Generate an edit script that transforms the original old AST into the original new AST, based on the initialized state of the generator.
     * @returns An array of edit actions (insertions, deletions, moves, updates) that represent the transformation from the old AST to the new AST.
     */
    generate(): EditScript {
        this.actions = [];
        this.newInOrder = new Map();
        this.oldInOrder = new Map();

        // Ensure idempotency in case generate() is called multiple times on the same instance.
        this.resetCpy();

        // BFS over the new tree.
        for (const xId of this.breadthFirst(this.ogNewAst.rootId)) {
            const yId = this.getDstParent(xId); // null only for dst root
            const zId = yId !== null ? this.cpyMappings.getSrcForDst(yId)! : null;

            let wId: NodeId;

            // If the node exists in the new AST but not the old it is a new node
            // i.e an insertion
            if (!this.cpyMappings.isDstMapped(xId)) {
                // zId is guaranteed to be non-null here as the new AST root is always mapped, so an unmapped node can only appear
                // below the root where yId is non-null.
                const k = this.findPos(xId);
                const xNode = this.getDstNode(xId);

                // Create a placeholder directly in the copy of the old AST
                wId = uuidv4();
                const placeholder: AstNode = {
                    ...xNode, // copy type and text from the dst node
                    id: wId,
                    parentId: zId!,
                    childrenIds: [],
                } as AstNode;
                this.cpyOldAst.nodes.set(wId, placeholder);

                // Map the placeholder's id in the copy old AST to the original old AST
                // simulating the insert operation
                this.cpyToOgIdMap.set(wId, xId);
                this.cpyMappings.addMapping(wId, xId);
                this.insertChild(zId!, wId, k);

                // Create an insert action
                const origZId = this.cpyToOgIdMap.get(zId!) ?? zId!;
                this.actions.push(new Insert(xNode, this.resolveOrigNode(origZId), k));
            }
            // Else if the node exists in both the new and old ASTs, it is either a move, an update, or both.
            else {
                // Find the corresponding node in the copy of the old AST using the mappings, this is the
                // node we will be moving/updating as we traverse the new AST.
                wId = this.cpyMappings.getSrcForDst(xId)!;

                // Skip the root as it has no parent to move/update into.
                if (xId !== this.ogNewAst.rootId) {
                    const wNode = this.getCpyNode(wId);
                    const xNode = this.getDstNode(xId);
                    const vId = wNode.parentId;

                    // If the text of the node has changed, generate an update action and update the
                    // text in the copy of the old AST to reflect the change, ensuring that subsequent move actions will have the correct text.
                    if (wNode.text !== xNode.text) {
                        const origWId = this.cpyToOgIdMap.get(wId) ?? wId;
                        this.actions.push(new Update(this.resolveOrigNode(origWId), xNode.text));
                        wNode.text = xNode.text;
                    }

                    // If the ids of the parents of w and x are different, we need to move w to be a
                    // child of the correct parent in the copy of the old AST to reflect the structure of the new AST as we traverse it.
                    if (zId !== vId) {
                        const k = this.findPos(xId);
                        const origWId = this.cpyToOgIdMap.get(wId) ?? wId;
                        const origZId = this.cpyToOgIdMap.get(zId!) ?? zId!;
                        this.actions.push(new Move(this.resolveOrigNode(origWId), this.resolveOrigNode(origZId), k));
                        this.removeFromParent(wId);
                        this.insertChild(zId!, wId, k);
                    }
                }
            }

            // Add w and x to the in-order maps, these will be used to align the children of w and x before processing the next node
            // in the BFS traversal to ensure that moves are generated before insertions for any given parent.
            this.oldInOrder.set(wId, this.getCpyNode(wId));
            this.newInOrder.set(xId, this.getDstNode(xId));
            this.alignChildren(wId, xId);
        }

        // If a node in the copy of the old AST is not mapped to any node in the new AST,
        // it means it does not exist in the new AST and must have been deleted, so we generate a delete action for it.
        for (const wId of this.postOrder(this.cpyOldAst.rootId)) {
            if (!this.cpyMappings.isSrcMapped(wId)) {
                const origWId = this.cpyToOgIdMap.get(wId) ?? wId;
                this.actions.push(new Delete(this.resolveOrigNode(origWId)));
            }
        }

        return this.actions;
    }

    /**
     * Computes the edit script to transform the old AST into the new AST based on the provided mappings.
     * This method initializes the internal state of the generator with the original ASTs and mappings, then calls generate() to produce the edit script.
     * @param ms - The original mappings between the old and new ASTs.
     * @returns An array of edit actions (insertions, deletions, moves, updates) that represent the transformation from the old AST to the new AST.
     */
    computeActions(ms: MappingStore): EditScript {
        this.init(ms);
        return this.generate();
    }

    /**
     * Aligns the children of the given nodes w and x in the copy of the old AST and the original new AST respectively,
     * by generating move actions for any children that are mapped to each other but are not in the same order in their respective parent nodes.
     * @param wId - The id of the node in the copy of the old AST whose children we want to align.
     * @param xId - The id of the node in the original new AST whose children we want to align with the children of w.
     */
    private alignChildren(wId: NodeId, xId: NodeId): void {
        // First remove all children of w and x from the in-order maps, we will add them back in the correct order after generating move
        // actions for any children that are out of order.
        for (const c of allChildIds(this.cpyOldAst, this.getCpyNode(wId))) this.oldInOrder.delete(c);
        for (const c of allChildIds(this.ogNewAst, this.getDstNode(xId))) this.newInOrder.delete(c);

        const xChildren = allChildIds(this.ogNewAst, this.getDstNode(xId));
        const wChildren = allChildIds(this.cpyOldAst, this.getCpyNode(wId));

        // Determine the longest common subsequence of children of w and x that are mapped to each other,
        // these are the children that are in the correct order and do not need to be moved.
        const s1: NodeId[] = [];
        for (const c of wChildren) {
            if (this.cpyMappings.isSrcMapped(c)) {
                const dstPartner = this.cpyMappings.getDstForSrc(c)!;
                if (xChildren.includes(dstPartner)) s1.push(c);
            }
        }

        // We iterate over the children of x in order and add any child that is mapped to a child of w to s2,
        // this is the order we want the children of w to be in after we generate move actions for any children that are out of order.
        const s2: NodeId[] = [];
        for (const c of xChildren) {
            if (this.cpyMappings.isDstMapped(c)) {
                const srcPartner = this.cpyMappings.getSrcForDst(c)!;
                if (wChildren.includes(srcPartner)) s2.push(c);
            }
        }

        // Compute the longest common subsequence of s1 and s2, these are the children that are in the correct order and do not need to be moved.
        const lcsResult = this.lcs(s1, s2);

        // Add the children in the longest common subsequence back to the in-order maps, as they are already in the correct order.
        for (const mapping of lcsResult) {
            this.oldInOrder.set(mapping.f, this.getCpyNode(mapping.f));
            this.newInOrder.set(mapping.s, this.getDstNode(mapping.s));
        }

        // First iterate over the s2 which is in the correct order and for each child in s2, if it is mapped to a child in
        // s1 that is not in the longest common subsequence, we need to move it to the correct position in the copy of the
        // old AST to reflect the order of the children in the new AST.
        for (const bId of s2) {
            for (const aId of s1) {
                if (this.cpyMappings.has(aId, bId)) {
                    const inLcs = lcsResult.some((m) => m.f === aId && m.s === bId);
                    if (!inLcs) {
                        this.removeFromParent(aId);
                        const k = this.findPos(bId);
                        const origAId = this.cpyToOgIdMap.get(aId) ?? aId;
                        const origWId = this.cpyToOgIdMap.get(wId) ?? wId;
                        this.actions.push(new Move(this.resolveOrigNode(origAId), this.resolveOrigNode(origWId), k));
                        this.insertChild(wId, aId, k);
                        this.oldInOrder.set(aId, this.getCpyNode(aId));
                        this.newInOrder.set(bId, this.getDstNode(bId));
                    }
                }
            }
        }
    }

    /**
     * Finds the position where the node with id xId should be inserted in the copy of the old AST to reflect the structure of the new AST as we traverse it.
     * @param xId - The id of the node in the original new AST.
     * @returns The position where the node with id xId should be inserted in the copy of the old AST.
     */
    private findPos(xId: NodeId): number {
        // The position of the new node xId is determined by its siblings that are already in the correct order and mapped to each other.
        const yId = this.getDstParent(xId);
        if (yId === null) return 0;

        const siblings = this.getDstNode(xId).parentId !== null ? allChildIds(this.ogNewAst, this.getDstNode(yId)) : [];

        for (const c of siblings) {
            if (this.newInOrder.has(c)) {
                if (c === xId) return 0;
                else break;
            }
        }

        const xpos = siblings.indexOf(xId);
        let vId: NodeId | null = null;
        for (let i = 0; i < xpos; i++) {
            if (this.newInOrder.has(siblings[i])) vId = siblings[i];
        }

        if (vId === null) return 0;

        const uId = this.cpyMappings.getSrcForDst(vId)!;
        return this.positionInParent(uId) + 1;
    }

    /**
     * Find the longest common subsequence
     * @param s1 -
     * @param s2 -
     * @returns
     */
    private lcs(s1: NodeId[], s2: NodeId[]): Mapping[] {
        const m = s1.length;
        const n = s2.length;
        const result: Mapping[] = [];

        const opt: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

        for (let i = m - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                const srcForDst = this.cpyMappings.getSrcForDst(s2[j]);
                opt[i][j] = srcForDst === s1[i] ? opt[i + 1][j + 1] + 1 : Math.max(opt[i + 1][j], opt[i][j + 1]);
            }
        }

        let i = 0,
            j = 0;
        while (i < m && j < n) {
            const srcForDst = this.cpyMappings.getSrcForDst(s2[j]);
            if (srcForDst === s1[i]) {
                result.push(new Mapping(s1[i], s2[j]));
                i++;
                j++;
            } else if (opt[i + 1][j] >= opt[i][j + 1]) {
                i++;
            } else {
                j++;
            }
        }

        return result;
    }

    /**
     * Get the corresponding node in the copy of the old AST given a node id.
     * @param id - The id of the node in the copy of the old AST.
     * @returns The corresponding node in the copy of the old AST.
     */
    private getCpyNode(id: NodeId): AstNode {
        const node = this.cpyOldAst.nodes.get(id);
        if (!node) throw new Error(`cpyOldAst node not found: ${id}`);
        return node;
    }

    /**
     * Get the corresponding node in the original new AST given a node id.
     * @param id -  The id of the node in the original new AST.
     * @returns  The corresponding node in the original new AST.
     */
    private getDstNode(id: NodeId): AstNode {
        const node = this.ogNewAst.nodes.get(id);
        if (!node) throw new Error(`ogNewAst node not found: ${id}`);
        return node;
    }

    /**
     * Resolve the original node in either the original old AST or the original new AST given a node id.
     * @param id -  The id of the node to resolve
     * @returns The corresponding node in either the original old AST or the original new AST
     */
    private resolveOrigNode(id: NodeId): AstNode {
        return (
            this.ogOldAst.nodes.get(id) ??
            this.ogNewAst.nodes.get(id) ??
            (() => {
                throw new Error(`Cannot resolve original AstNode for id: ${id}`);
            })()
        );
    }

    /**
     * Get the parent id of the node with the given id in the copy of the old AST.
     * @param id -  The id of the node in the copy of the old AST whose parent id we want to get.
     * @returns  The parent id of the node with the given id in the copy of the old AST, or null if the node is the root.
     */
    private getParentId(id: NodeId): NodeId | null {
        return this.getCpyNode(id).parentId;
    }

    /**
     * Inserts a child node with the given childId as a child of the node with the given parentId in the copy of the old AST at the specified position,
     * and updates the parentId of the child node accordingly.
     * @param parentId - The id of the parent node in the copy of the old AST where the child node should be inserted.
     * @param childId - The id of the child node in the copy of the old AST that should be inserted as a child of the parent node.
     * @param pos - The position in the children array of the parent node where the child node should be inserted.
     */
    private insertChild(parentId: NodeId, childId: NodeId, pos: number) {
        this.getCpyNode(parentId).childrenIds.splice(pos, 0, childId);
        this.getCpyNode(childId).parentId = parentId;
    }

    /**
     * Remove the node with the given id from its parent in the copy of the old AST, and update the parentId of the node accordingly.
     * @param id -  The id of the node in the copy of the old AST that should be removed from its parent.
     */
    private removeFromParent(id: NodeId) {
        const parentId = this.getParentId(id);
        if (parentId === null) return;
        const siblings = this.getCpyNode(parentId).childrenIds;
        const idx = siblings.indexOf(id);
        if (idx !== -1) siblings.splice(idx, 1);
        this.getCpyNode(id).parentId = null;
    }

    /**
     * Determines the position of the node with the given id in its parent's children array in the copy of the old AST.
     * @param id - The id of the node in the copy of the old AST whose position in its parent's children array we want to determine.
     * @returns The position of the node with the given id in its parent's children array in the copy of the old AST, or 0 if the node is the root.
     */
    private positionInParent(id: NodeId): number {
        const parentId = this.getParentId(id);
        if (parentId === null) return 0;
        return this.getCpyNode(parentId).childrenIds.indexOf(id);
    }

    /**
     * Get the parent id of the node with the given id in the original new AST.
     * @param id - The id of the node in the original new AST whose parent id we want to get.
     * @returns  The parent id of the node with the given id in the original new AST, or null if the node is the root.
     */
    private getDstParent(id: NodeId): NodeId | null {
        return this.getDstNode(id).parentId;
    }

    /**
     * Local breadth first search helper method to traverse the original new AST in breadth first order, starting from the node with the given rootId.
     * @param rootId - The id of the root node in the original new AST from which to start the breadth first traversal.
     * @returns  An array of node ids in the original new AST in the order they were visited in the breadth first traversal.
     */
    private breadthFirst(rootId: NodeId): NodeId[] {
        const result: NodeId[] = [];
        const queue: NodeId[] = [rootId];
        while (queue.length > 0) {
            const id = queue.shift()!;
            result.push(id);
            const children = allChildIds(this.ogNewAst, this.getDstNode(id));
            for (const child of children) queue.push(child);
        }
        return result;
    }

    /**
     * Local post order search helper method to traverse the copy of the old AST in post order, starting from the node with the given rootId.
     * @param rootId -  The id of the root node in the copy of the old AST from which to start the post order traversal.
     * @returns An array of node ids in the copy of the old AST in the order they were visited in the post order traversal.
     */
    private postOrder(rootId: NodeId): NodeId[] {
        const result: NodeId[] = [];
        const visit = (id: NodeId) => {
            const children = allChildIds(this.cpyOldAst, this.getCpyNode(id));
            for (const child of children) visit(child);
            result.push(id);
        };
        visit(rootId);
        return result;
    }
}
