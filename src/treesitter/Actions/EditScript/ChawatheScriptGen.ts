import { AstNode, BragiAST, NodeId } from "../../types";
import { MappingStore, Mapping } from "../../types/GumTree";
import { preoderAstTraversal, preorderAstTraversalIterator } from "../../utils";
import { EditScript, EditScriptGen } from "./EditScriptGen";
import { Delete, Insert, Move, Update } from "../Model/index.js";
import { v4 as uuidv4 } from "uuid";

export class ChawatheScriptGen implements EditScriptGen {
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

    init(m: MappingStore) {
        this.ogOldAst = m.oldAst;
        this.ogNewAst = m.newAst;
        this.ogMappings = m;

        this.resetCpy();
    }

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

            if (!this.cpyMappings.isDstMapped(xId)) {
                // INSERTION
                // zId is guaranteed non-null here: the dst root is always
                // mapped (it maps to the cpy src root), so an unmapped node
                // can only appear below the root where yId is non-null.
                const k = this.findPos(xId);
                const xNode = this.getDstNode(xId);

                // Create a placeholder directly in cpyOldAst.nodes.
                // It's a real-shaped AstNode with a fresh UUID so all
                // existing helpers work without any special-casing.
                wId = uuidv4();
                const placeholder: AstNode = {
                    ...xNode, // copy type and text from the dst node
                    id: wId,
                    parentId: zId!,
                    childrenIds: [],
                } as AstNode;
                this.cpyOldAst.nodes.set(wId, placeholder);

                // The placeholder's orig resolves to the dst node x, so
                // that future resolveOrigNode(cpyToOgIdMap[w]) returns x.
                this.cpyToOgIdMap.set(wId, xId);
                this.cpyMappings.addMapping(wId, xId);
                this.insertChild(zId!, wId, k);

                // Action: inserted node is x, parent is the orig-src node
                // that z corresponds to.
                const origZId = this.cpyToOgIdMap.get(zId!) ?? zId!;
                this.actions.push(new Insert(xNode, this.resolveOrigNode(origZId), k));
            } else {
                // MATCHED NODE
                wId = this.cpyMappings.getSrcForDst(xId)!;

                // Skip the root as it has no parent to move/update into.
                if (xId !== this.ogNewAst.rootId) {
                    const wNode = this.getCpyNode(wId);
                    const xNode = this.getDstNode(xId);
                    const vId = wNode.parentId;

                    // UPDATE
                    if (wNode.text !== xNode.text) {
                        const origWId = this.cpyToOgIdMap.get(wId) ?? wId;
                        this.actions.push(new Update(this.resolveOrigNode(origWId), xNode.text));
                        wNode.text = xNode.text;
                    }

                    // MOVE
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

            this.oldInOrder.set(wId, this.getCpyNode(wId));
            this.newInOrder.set(xId, this.getDstNode(xId));
            this.alignChildren(wId, xId);
        }

        // DELETIONS
        for (const wId of this.postOrder(this.cpyOldAst.rootId)) {
            if (!this.cpyMappings.isSrcMapped(wId)) {
                const origWId = this.cpyToOgIdMap.get(wId) ?? wId;
                this.actions.push(new Delete(this.resolveOrigNode(origWId)));
            }
        }

        return this.actions;
    }

    computeActions(ms: MappingStore): EditScript {
        this.init(ms);
        return this.generate();
    }

    private alignChildren(wId: NodeId, xId: NodeId): void {
        for (const c of this.getCpyNode(wId).childrenIds) this.oldInOrder.delete(c);
        for (const c of this.getDstNode(xId).childrenIds) this.newInOrder.delete(c);

        const xChildren = this.getDstNode(xId).childrenIds;
        const wChildren = this.getCpyNode(wId).childrenIds;

        // s1: children of w mapped to a child of x.
        const s1: NodeId[] = [];
        for (const c of wChildren) {
            if (this.cpyMappings.isSrcMapped(c)) {
                const dstPartner = this.cpyMappings.getDstForSrc(c)!;
                if (xChildren.includes(dstPartner)) s1.push(c);
            }
        }

        // s2: children of x mapped to a child of w.
        const s2: NodeId[] = [];
        for (const c of xChildren) {
            if (this.cpyMappings.isDstMapped(c)) {
                const srcPartner = this.cpyMappings.getSrcForDst(c)!;
                if (wChildren.includes(srcPartner)) s2.push(c);
            }
        }

        const lcsResult = this.lcs(s1, s2);

        for (const mapping of lcsResult) {
            this.oldInOrder.set(mapping.f, this.getCpyNode(mapping.f));
            this.newInOrder.set(mapping.s, this.getDstNode(mapping.s));
        }

        // Iterate s2 first to guarantee left-to-right insertion order.
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

    private findPos(xId: NodeId): number {
        const yId = this.getDstParent(xId);
        if (yId === null) return 0;

        const siblings = this.getDstNode(xId).parentId !== null ? this.getDstNode(yId).childrenIds : [];

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

    private getCpyNode(id: NodeId): AstNode {
        const node = this.cpyOldAst.nodes.get(id);
        if (!node) throw new Error(`cpyOldAst node not found: ${id}`);
        return node;
    }

    private getDstNode(id: NodeId): AstNode {
        const node = this.ogNewAst.nodes.get(id);
        if (!node) throw new Error(`ogNewAst node not found: ${id}`);
        return node;
    }

    private resolveOrigNode(id: NodeId): AstNode {
        return (
            this.ogOldAst.nodes.get(id) ??
            this.ogNewAst.nodes.get(id) ??
            (() => {
                throw new Error(`Cannot resolve original AstNode for id: ${id}`);
            })()
        );
    }

    private getParentId(id: NodeId): NodeId | null {
        return this.getCpyNode(id).parentId;
    }

    private insertChild(parentId: NodeId, childId: NodeId, pos: number): void {
        this.getCpyNode(parentId).childrenIds.splice(pos, 0, childId);
        this.getCpyNode(childId).parentId = parentId;
    }

    private removeFromParent(id: NodeId): void {
        const parentId = this.getParentId(id);
        if (parentId === null) return;
        const siblings = this.getCpyNode(parentId).childrenIds;
        const idx = siblings.indexOf(id);
        if (idx !== -1) siblings.splice(idx, 1);
        this.getCpyNode(id).parentId = null;
    }

    private positionInParent(id: NodeId): number {
        const parentId = this.getParentId(id);
        if (parentId === null) return 0;
        return this.getCpyNode(parentId).childrenIds.indexOf(id);
    }

    private getDstParent(id: NodeId): NodeId | null {
        return this.getDstNode(id).parentId;
    }

    private breadthFirst(rootId: NodeId): NodeId[] {
        const result: NodeId[] = [];
        const queue: NodeId[] = [rootId];
        while (queue.length > 0) {
            const id = queue.shift()!;
            result.push(id);
            for (const child of this.getDstNode(id).childrenIds) queue.push(child);
        }
        return result;
    }

    private postOrder(rootId: NodeId): NodeId[] {
        const result: NodeId[] = [];
        const visit = (id: NodeId) => {
            for (const child of this.getCpyNode(id).childrenIds) visit(child);
            result.push(id);
        };
        visit(rootId);
        return result;
    }
}
