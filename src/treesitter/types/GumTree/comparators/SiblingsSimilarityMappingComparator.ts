import { NodeId, AstNode, BragiAST, allChildIds } from "../../AST";
import { MappingStore, Mapping } from "../GumTree";
import { getParent, diceCoefficient } from "../utils";


export class SiblingsSimilarityMappingComparator {
    private ms: MappingStore;

    private srcDescendants: Map<NodeId, AstNode[]> = new Map();
    private dstDescendants: Map<NodeId, AstNode[]> = new Map();
    private cachedSimilarities: Map<Mapping, number> = new Map();
    private srcTree: BragiAST;
    private dstTree: BragiAST;

    constructor(ms: MappingStore, srcTree: BragiAST, dstTree: BragiAST) {
        this.ms = ms;
        this.srcTree = srcTree;
        this.dstTree = dstTree;
    }

    compare(m1: Mapping, m2: Mapping) {
        const m1SrcParent = getParent(m1.f, this.srcTree);
        const m1DstParent = getParent(m1.s, this.dstTree);
        const m2SrcParent = getParent(m2.f, this.srcTree);
        const m2DstParent = getParent(m2.s, this.dstTree);

        if (m1SrcParent === m2SrcParent && m1DstParent === m2DstParent) return 0;

        if (!this.cachedSimilarities.has(m1)) {
            this.cachedSimilarities.set(m1, diceCoefficient(
                this.commonDescendantsNb(m1SrcParent!.id, m1DstParent!.id),
                this.srcDescendants.get(m1SrcParent!.id)!.length,
                this.dstDescendants.get(m1DstParent!.id)!.length));
        }

        if (!this.cachedSimilarities.has(m2)) {
            this.cachedSimilarities.set(m2, diceCoefficient(
                this.commonDescendantsNb(m2SrcParent!.id, m2DstParent!.id),
                this.srcDescendants.get(m2SrcParent!.id)!.length,
                this.dstDescendants.get(m2DstParent!.id)!.length));
        }

        return this.cachedSimilarities.get(m2)! - this.cachedSimilarities.get(m1)!;
    }

    private getDescendants(nodeId: NodeId, tree: BragiAST): AstNode[] {
        const descendants: AstNode[] = [];
        const node = tree.nodes.get(nodeId)!;
        const children = allChildIds(tree, node);
        for (const childId of children) {
            const child = tree.nodes.get(childId)!;
            descendants.push(child);
            descendants.push(...this.getDescendants(childId, tree));
        }
        return descendants;
    }

    private putIfAbsent(map: Map<NodeId, AstNode[]>, key: NodeId, value: AstNode[]) {
        if (!map.has(key)) map.set(key, value);
    }

    private commonDescendantsNb(src: NodeId, dst: NodeId): number {
        this.putIfAbsent(this.srcDescendants, src, this.getDescendants(src, this.srcTree));
        this.putIfAbsent(this.dstDescendants, dst, this.getDescendants(dst, this.dstTree));

        let common = 0;
        for (const t of this.srcDescendants.get(src)!) {
            const m = this.ms.getDstForSrc(t.id);
            if (m !== null && this.dstDescendants.get(dst)?.some(n => n.id === m)) {
                common++;
            }
        }
        return common;
    }
}