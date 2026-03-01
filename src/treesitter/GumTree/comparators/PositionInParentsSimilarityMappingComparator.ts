import { allChildIds, type AstNode, type BragiAST } from "../../types/AST.js";
import type { Mapping } from "../../types/GumTree.js";

export class PositionInParentsSimilarityMappingComparator {
    private srcTree: BragiAST;
    private dstTree: BragiAST;

    constructor(srcTree: BragiAST, dstTree: BragiAST) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
    }

    compare(m1: Mapping, m2: Mapping) {
        const m1Distance: number = this.distance(m1);
        const m2Distance: number = this.distance(m2);
        return m1Distance - m2Distance;
    }

    distance(m: Mapping): number {
        const posVector1: number[] = this.posVector(this.srcTree.nodes.get(m.f)!, this.srcTree);
        const posVector2: number[] = this.posVector(this.dstTree.nodes.get(m.s)!, this.dstTree);
        let sum = 0;
        for (let i = 0; i < Math.min(posVector1.length, posVector2.length); i++) {
            sum += (posVector1[i] - posVector2[i]) * (posVector1[i] - posVector2[i]);
        }
        return Math.sqrt(sum);
    }

    posVector(src: AstNode, tree: BragiAST) {
        const posVector: number[] = [];
        let current: AstNode = src;
        while (current != null && current.parentId != null) {
            const parent: AstNode = tree.nodes.get(current.parentId)!;
            const children = allChildIds(tree, src);
            const pos: number = children.indexOf(current.id);
            posVector.push(pos);
            current = parent;
        }
        return posVector;
    }
}

