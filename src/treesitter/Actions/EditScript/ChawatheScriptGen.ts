import { allChildIds, AstNode, BragiAST, NodeId } from "../../types/index.js";
import { MappingStore, Mapping } from "../../types/GumTree.js";
import { preoderAstTraversal, preorderAstTraversalIterator } from "../../utils.js";
import { EditScript, EditScriptGen } from "./EditScriptGen.js";
import { Delete, Insert, Move, Update } from "../Model/index.js";
import { v4 as uuidv4 } from "uuid";

const FAKE_ROOT_ID = "__fake_root__";

/**
 * ChawatheScriptGen implements the edit script generation algorthm described in "Change Detection in Hierarchically Structured Information" by Chawathe et al.
 * based on the implementation described in "GumTree: Fast and Accurate Tree Differencing" by Falleri et al, and the original ChawatheScriptGenerator implementation in Java
 * (https://github.com/GumTreeDiff/gumtree/blob/main/core/src/main/java/com/github/gumtreediff/actions/ChawatheScriptGenerator.java).
 *
 * This algorthm is a top-down, left-to-right traversal of the destination tree, generating insertions and moves/updates as it goes,
 * followed by a bottom-up traversal of the source tree to generate deletions.
 */
export class ChawatheScriptGen implements EditScriptGen {
    origSrc!: BragiAST;
    cpySrc!: BragiAST;
    origDst!: BragiAST;
    origMappings!: MappingStore;
    cpyMappings!: MappingStore;

    dstInOrder!: Set<NodeId>;
    srcInOrder!: Set<NodeId>;
    actions!: EditScript;

    origToCopy!: Map<NodeId, NodeId>;
    copyToOrig!: Map<NodeId, NodeId>;

    public computeActions(ms: MappingStore): EditScript {
        this.initWith(ms);
        this.generate();
        return this.actions;
    }

    public initWith(ms: MappingStore): void {
        this.origSrc = ms.oldAst;
        this.origDst = ms.newAst;
        this.origMappings = ms;

        this.origToCopy = new Map();
        this.copyToOrig = new Map();

        // Deep copy the original source AST
        // We mutate cpySrc through the algorithm but need to preserve origSrc
        this.cpySrc = {
            rootId: "",
            nodes: new Map(),
        };

        for (const [id, node] of this.origSrc.nodes.entries()) {
            const newId = uuidv4();
            this.origToCopy.set(id, newId);
            this.copyToOrig.set(newId, id);
            // Shallow clone the node properties, we'll remap the relationship IDs next
            this.cpySrc.nodes.set(newId, { ...node, id: newId, childrenIds: [...node.childrenIds] });
        }

        this.cpySrc.rootId = this.origToCopy.get(this.origSrc.rootId)!;

        // Update copied parent and children relationships to point to new IDs
        for (const node of this.cpySrc.nodes.values()) {
            if (node.parentId) {
                node.parentId = this.origToCopy.get(node.parentId) || null;
            }
            node.childrenIds = node.childrenIds.map((cid) => this.origToCopy.get(cid)!);
        }

        // Initialize mapping store between the copy and the original destination
        this.cpyMappings = new MappingStore(this.cpySrc, this.origDst);
        for (const m of ms) {
            this.cpyMappings.addMapping(this.origToCopy.get(m.f)!, m.s);
        }
    }

    public generate(): EditScript {
        const srcFakeRootId = uuidv4();
        const dstFakeRootId = uuidv4();

        const origSrcRootId = this.cpySrc.rootId;
        const origDstRootId = this.origDst.rootId;

        // Create and inject fake roots. The algorithm requires a stable root parent
        // to handle operations that apply to the actual roots.
        const srcFakeRoot: AstNode = {
            id: srcFakeRootId,
            type: FAKE_ROOT_ID as any,
            text: "",
            startIndex: 0,
            endIndex: 0,
            parentId: null,
            childrenIds: [origSrcRootId],
        };
        this.cpySrc.nodes.set(srcFakeRootId, srcFakeRoot);
        this.cpySrc.nodes.get(origSrcRootId)!.parentId = srcFakeRootId;
        this.cpySrc.rootId = srcFakeRootId;

        const dstFakeRoot: AstNode = {
            id: dstFakeRootId,
            type: FAKE_ROOT_ID as any,
            text: "",
            startIndex: 0,
            endIndex: 0,
            parentId: null,
            childrenIds: [origDstRootId],
        };
        this.origDst.nodes.set(dstFakeRootId, dstFakeRoot);
        this.origDst.nodes.get(origDstRootId)!.parentId = dstFakeRootId;
        this.origDst.rootId = dstFakeRootId;

        this.actions = [];
        this.dstInOrder = new Set();
        this.srcInOrder = new Set();

        this.cpyMappings.addMapping(srcFakeRootId, dstFakeRootId);

        // BFS starting from the original destination root (excluding the fake root)
        const queue: NodeId[] = [origDstRootId];
        const bfsDst: NodeId[] = [];
        while (queue.length > 0) {
            const id = queue.shift()!;
            bfsDst.push(id);
            const node = this.origDst.nodes.get(id);
            if (node && node.childrenIds) {
                queue.push(...node.childrenIds);
            }
        }

        for (const x of bfsDst) {
            let w: NodeId;
            const xNode = this.origDst.nodes.get(x)!;
            const y = xNode.parentId!;
            const z = this.cpyMappings.getSrcForDst(y)!;
            const zNode = this.cpySrc.nodes.get(z)!;

            if (!this.cpyMappings.isDstMapped(x)) {
                const k = this.findPos(x);
                // Insertion case: create new fake node based on destination node
                w = uuidv4();
                const wFakeNode: AstNode = { ...xNode, id: w, parentId: z, childrenIds: [] };
                this.cpySrc.nodes.set(w, wFakeNode);

                const xOrigNode = this.origDst.nodes.get(x)!;
                const zOrigNodeId = this.copyToOrig.get(z)!;
                const zOrigNode = this.origSrc.nodes.get(zOrigNodeId)!;

                this.actions.push(new Insert(xOrigNode, zOrigNode, k));
                this.copyToOrig.set(w, x);
                this.cpyMappings.addMapping(w, x);

                zNode.childrenIds.splice(k, 0, w);
            } else {
                w = this.cpyMappings.getSrcForDst(x)!;
                const wNode = this.cpySrc.nodes.get(w)!;

                if (x !== origDstRootId) {
                    const v = wNode.parentId!;
                    if (wNode.text !== xNode.text) {
                        const wOrigNodeId = this.copyToOrig.get(w)!;
                        const wOrigNode = this.origSrc.nodes.get(wOrigNodeId)!;
                        this.actions.push(new Update(wOrigNode, xNode.text, xNode));
                        wNode.text = xNode.text;
                    }
                    if (z !== v) {
                        const k = this.findPos(x);
                        const wOrigNodeId = this.copyToOrig.get(w)!;
                        const wOrigNode = this.origSrc.nodes.get(wOrigNodeId)!;
                        const zOrigNodeId = this.copyToOrig.get(z)!;
                        const zOrigNode = this.origSrc.nodes.get(zOrigNodeId)!;

                        this.actions.push(new Move(wOrigNode, zOrigNode, k));

                        const oldParentNode = this.cpySrc.nodes.get(wNode.parentId!)!;
                        const oldK = oldParentNode.childrenIds.indexOf(w);
                        if (oldK !== -1) oldParentNode.childrenIds.splice(oldK, 1);

                        wNode.parentId = z;
                        zNode.childrenIds.splice(k, 0, w);
                    }
                }
            }

            this.srcInOrder.add(w);
            this.dstInOrder.add(x);
            this.alignChildren(w, x);
        }

        // Post-order traversal to generate Deletes
        const postOrderSrc: AstNode[] = [];
        const traversePostOrder = (id: NodeId) => {
            const node = this.cpySrc.nodes.get(id);
            if (!node) return;
            for (const cid of node.childrenIds) traversePostOrder(cid);
            postOrderSrc.push(node);
        };
        // Start from the original root so we skip the fake root itself
        traversePostOrder(origSrcRootId);

        for (const wNode of postOrderSrc) {
            const w = wNode.id;
            if (!this.cpyMappings.isSrcMapped(w)) {
                const wOrigNodeId = this.copyToOrig.get(w)!;
                const wOrigNode = this.origSrc.nodes.get(wOrigNodeId)!;
                this.actions.push(new Delete(wOrigNode));
            }
        }

        // Clean up the fake root in the user's AST to prevent side effects
        this.origDst.nodes.delete(dstFakeRootId);
        this.origDst.nodes.get(origDstRootId)!.parentId = null;
        this.origDst.rootId = origDstRootId;

        return this.actions;
    }

    private alignChildren(w: NodeId, x: NodeId): void {
        const wNode = this.cpySrc.nodes.get(w)!;
        const xNode = this.origDst.nodes.get(x)!;

        for (const child of wNode.childrenIds) this.srcInOrder.delete(child);
        for (const child of xNode.childrenIds) this.dstInOrder.delete(child);

        const s1: NodeId[] = [];
        for (const c of wNode.childrenIds) {
            if (this.cpyMappings.isSrcMapped(c)) {
                const dstForC = this.cpyMappings.getDstForSrc(c)!;
                if (xNode.childrenIds.includes(dstForC)) {
                    s1.push(c);
                }
            }
        }

        const s2: NodeId[] = [];
        for (const c of xNode.childrenIds) {
            if (this.cpyMappings.isDstMapped(c)) {
                const srcForC = this.cpyMappings.getSrcForDst(c)!;
                if (wNode.childrenIds.includes(srcForC)) {
                    s2.push(c);
                }
            }
        }

        const lcsList = this.lcs(s1, s2);

        for (const m of lcsList) {
            this.srcInOrder.add(m.f);
            this.dstInOrder.add(m.s);
        }

        for (const b of s2) {
            for (const a of s1) {
                if (this.cpyMappings.has(a, b)) {
                    if (!lcsList.some((m) => m.f === a && m.s === b)) {
                        const aNode = this.cpySrc.nodes.get(a)!;
                        const aParentNode = this.cpySrc.nodes.get(aNode.parentId!)!;

                        const aIndex = aParentNode.childrenIds.indexOf(a);
                        if (aIndex !== -1) aParentNode.childrenIds.splice(aIndex, 1);

                        const k = this.findPos(b);

                        const aOrigNodeId = this.copyToOrig.get(a)!;
                        const aOrigNode = this.origSrc.nodes.get(aOrigNodeId)!;
                        const wOrigNodeId = this.copyToOrig.get(w)!;
                        const wOrigNode = this.origSrc.nodes.get(wOrigNodeId)!;

                        this.actions.push(new Move(aOrigNode, wOrigNode, k));

                        wNode.childrenIds.splice(k, 0, a);
                        aNode.parentId = w;

                        this.srcInOrder.add(a);
                        this.dstInOrder.add(b);
                    }
                }
            }
        }
    }

    private findPos(x: NodeId): number {
        const xNode = this.origDst.nodes.get(x)!;
        const yNode = this.origDst.nodes.get(xNode.parentId!)!;
        const siblings = yNode.childrenIds;

        for (const c of siblings) {
            if (this.dstInOrder.has(c)) {
                if (c === x) return 0;
                else break;
            }
        }

        const xpos = siblings.indexOf(x);
        let v: NodeId | null = null;
        for (let i = 0; i < xpos; i++) {
            const c = siblings[i];
            if (this.dstInOrder.has(c)) v = c;
        }

        if (v === null) return 0;

        const u = this.cpyMappings.getSrcForDst(v)!;
        const uNode = this.cpySrc.nodes.get(u)!;
        const uParentNode = this.cpySrc.nodes.get(uNode.parentId!)!;
        const upos = uParentNode.childrenIds.indexOf(u);

        return upos + 1;
    }

    private lcs(x: NodeId[], y: NodeId[]): Mapping[] {
        const m = x.length;
        const n = y.length;
        const lcsResult: Mapping[] = [];

        const opt: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

        for (let i = m - 1; i >= 0; i--) {
            for (let j = n - 1; j >= 0; j--) {
                if (this.cpyMappings.getSrcForDst(y[j]) === x[i]) {
                    opt[i][j] = opt[i + 1][j + 1] + 1;
                } else {
                    opt[i][j] = Math.max(opt[i + 1][j], opt[i][j + 1]);
                }
            }
        }

        let i = 0,
            j = 0;
        while (i < m && j < n) {
            if (this.cpyMappings.getSrcForDst(y[j]) === x[i]) {
                lcsResult.push(new Mapping(x[i], y[j]));
                i++;
                j++;
            } else if (opt[i + 1][j] >= opt[i][j + 1]) {
                i++;
            } else {
                j++;
            }
        }

        return lcsResult;
    }
}
