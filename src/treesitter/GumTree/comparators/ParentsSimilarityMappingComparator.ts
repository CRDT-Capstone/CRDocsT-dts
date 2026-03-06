import { NodeId, AstNode, BragiAST } from "../../types/AST.js";
import { Mapping } from "../../types/GumTree.js";
import { diceCoefficient, getParent, getParents, longestCommonSubsequenceWithType } from "../utils.js";

export class ParentsSimilarityMappingComparator {
    private srcAncestors: Map<NodeId, AstNode[]> = new Map();
    private dstAncestors: Map<NodeId, AstNode[]> = new Map();
    private cachedSimilarities: Map<Mapping, number> = new Map();
    private srcTree: BragiAST;
    private dstTree: BragiAST;

    constructor(srcTree: BragiAST, dstTree: BragiAST) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
    }

    private putIfAbsent(map: Map<NodeId, AstNode[]>, key: NodeId, nodes: AstNode[]) {
        if (!map.has(key)) map.set(key, nodes);
    }

    compare(m1: Mapping, m2: Mapping) {
        if (
            getParent(m1.f, this.srcTree) === getParent(m2.f, this.srcTree) &&
            getParent(m1.s, this.dstTree) === getParent(m2.s, this.dstTree)
        )
            return 0;

        this.putIfAbsent(this.srcAncestors, m1.f, getParents(this.srcTree, [], m1.f));
        this.putIfAbsent(this.dstAncestors, m1.s, getParents(this.dstTree, [], m1.s));
        this.putIfAbsent(this.srcAncestors, m2.f, getParents(this.srcTree, [], m2.f));
        this.putIfAbsent(this.dstAncestors, m2.s, getParents(this.dstTree, [], m2.s));

        if (!this.cachedSimilarities.has(m1)) {
            const m1Sim: number = diceCoefficient(
                this.commonParentsNb(m1.f, m1.s),
                this.srcAncestors.get(m1.f)!.length,
                this.dstAncestors.get(m1.s)!.length,
            );
            this.cachedSimilarities.set(m1, m1Sim);
        }

        if (!this.cachedSimilarities.has(m2)) {
            const m2Sim: number = diceCoefficient(
                this.commonParentsNb(m2.f, m2.s),
                this.srcAncestors.get(m2.f)!.length,
                this.dstAncestors.get(m2.s)!.length,
            );
            this.cachedSimilarities.set(m2, m2Sim);
        }

        return this.cachedSimilarities.get(m2)! - this.cachedSimilarities.get(m1)!;
    }

    commonParentsNb(src: NodeId, dst: NodeId) {
        return longestCommonSubsequenceWithType(this.srcAncestors.get(src)!, this.dstAncestors.get(dst)!).length;
    }
}
