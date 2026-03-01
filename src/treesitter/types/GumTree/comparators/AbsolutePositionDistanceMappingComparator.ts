
import { type BragiAST, type NodeId } from "../../AST";
import type { Mapping } from "../GumTree";
import type { TreeMetricComputer } from "../TreeMetricComputer";

export class AbsolutePositionDistanceMappingComparator {
    private srcTree: BragiAST;
    private dstTree: BragiAST;
    private srcMetricComputer: TreeMetricComputer;
    private dstMetricComputer: TreeMetricComputer;

    constructor(srcTree: BragiAST, dstTree: BragiAST, srcMetricComputer: TreeMetricComputer, dstMetricComputer: TreeMetricComputer) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
        this.srcMetricComputer = srcMetricComputer;
        this.dstMetricComputer = dstMetricComputer;
    }

    compare(m1: Mapping, m2: Mapping) {
        const m1PosDist: number = this.absolutePositionDistance(m1.f, m1.s);
        const m2PosDist: number = this.absolutePositionDistance(m2.f, m2.s);
        return m1PosDist - m2PosDist;
    }

    absolutePositionDistance(src: NodeId, dst: NodeId): number {
        const srcPosition = this.srcMetricComputer.getMetrics().get(src)?.position;
        const dstPosition = this.dstMetricComputer.getMetrics().get(dst)?.position;
        return Math.abs(srcPosition! - dstPosition!);
    }
}