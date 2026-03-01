import FastPriorityQueue from "fastpriorityqueue";
import { BragiAST, AstNode, NodeId } from "./types";
import { FullMappingComparator } from "./types/GumTree/comparators/FullMappingComparator";
import { MappingStore, Mapping } from "./types/GumTree/GumTree";
import { Pair, HashBasedMapper } from "./types/GumTree/HashBasedMapper";
import { TreeMetricComputer } from "./types/GumTree/TreeMetricComputer";
import { TreeMetrics } from "./types/GumTree/TreeMetrics";


export type pqType = {
    nodeId: string,
    height: number
};

export class GumTreeTopDown {

    private srcTree: BragiAST;
    private dstTree: BragiAST;
    private srcTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    private dstTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    private srcMetrics: TreeMetricComputer = new TreeMetricComputer();
    private dstMetrics: TreeMetricComputer = new TreeMetricComputer();
    private mappings: MappingStore;

    constructor(srcTree: BragiAST, dstTree: BragiAST) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
        this.mappings = new MappingStore(srcTree, dstTree);
        this.srcMetrics.buildMetrics(this.srcTree, this.srcTree.nodes.get(this.srcTree.rootId));
        this.dstMetrics.buildMetrics(this.dstTree, this.dstTree.nodes.get(this.dstTree.rootId));
    }

    private IsInQueue(entry: pqType, pq: FastPriorityQueue<pqType>) {
        let isIn = false;
        pq.forEach((node) => {
            if (node.height === entry.height && node.nodeId === entry.nodeId) {
                isIn = true;
            }
        });
        return isIn;
    }

    private AddChildrenToQueue(node: AstNode, PQ: FastPriorityQueue<pqType>, metricComputer: TreeMetricComputer) {
        const childrenIds = (node.type === "text") ? node.word : node.childrenIds;
        for (const nodeId of childrenIds) {
            const height = metricComputer.getMetrics().get(nodeId)!.height

            if (!this.IsInQueue({ nodeId, height }, PQ)) {
                PQ.add({
                    nodeId,
                    height
                });
            }

        }
    }


    private addNodeToPQ(PQ: FastPriorityQueue<pqType>, tree: BragiAST, metricComputer: TreeMetricComputer, nodeId: NodeId) {
        const node = tree.nodes.get(nodeId);
        if (!node) return;

        const height = metricComputer.getMetrics().get(nodeId)!.height;
        PQ.add({
            nodeId: nodeId,
            height
        });
    }



    topDown = () => {

        this.addNodeToPQ(this.srcTreePQ, this.srcTree, this.srcMetrics, this.srcTree.rootId);
        this.addNodeToPQ(this.dstTreePQ, this.dstTree, this.dstMetrics, this.dstTree.rootId);

        const ambiguousMappings: Pair<Set<AstNode>>[] = [];

        while (this.synchronize()) {
            const localHashMappings = new HashBasedMapper(this.srcTree, this.dstTree, this.srcMetrics, this.dstMetrics);
            const srcTopHeight = this.srcTreePQ.peek()!.height;
            localHashMappings.addSrcNodesFromQueue(this.srcTreePQ);
            while (this.srcTreePQ.peek()?.height === srcTopHeight) this.srcTreePQ.poll();

            const dstTopHeight = this.dstTreePQ.peek()!.height;
            localHashMappings.addDstNodesFromQueue(this.dstTreePQ);
            while (this.dstTreePQ.peek()?.height === dstTopHeight) this.dstTreePQ.poll();

            localHashMappings.unique().forEach((pair) => {

                this.mappings.addMappingRecursively(
                    pair.first.values().next().value!.id,
                    pair.second.values().next().value!.id
                );
            });

            localHashMappings.ambiguous().forEach((pair) => { ambiguousMappings.push(pair) });

            localHashMappings.unmapped().forEach((pair) => {
                pair.first.forEach((srcNode) => {
                    this.AddChildrenToQueue(srcNode, this.srcTreePQ, this.srcMetrics);
                });

                pair.second.forEach((dstNode) => {
                    this.AddChildrenToQueue(dstNode, this.dstTreePQ, this.dstMetrics);
                });
            });
        }

        this.handleAmbiguousMappings(ambiguousMappings);

        return this.mappings;

    }

    handleAmbiguousMappings(ambiguousMappings: Pair<Set<AstNode>>[]) {
        const comparator: FullMappingComparator = new FullMappingComparator(this.mappings, this.srcTree, this.dstTree, this.srcMetrics, this.dstMetrics);
        ambiguousMappings.sort((m1, m2) => this.ambiguousMappingsComparator(m1, m2, this.srcMetrics.getMetrics()));
        ambiguousMappings.forEach((pair) => {
            const candidates: Mapping[] = this.convertToMappings(pair);
            candidates.sort((m1, m2) => comparator.compare(m1, m2));
            candidates.forEach((mapping) => {
                if (this.mappings.areBothUnmapped(mapping.f, mapping.s)) {
                    this.mappings.addMappingRecursively(mapping.f, mapping.s);
                }
            })
        })
    }

    convertToMappings(ambiguousMappings: Pair<Set<AstNode>>) {
        const mappings: Mapping[] = [];
        for (const srcNode of ambiguousMappings.first) {
            for (const dstNode of ambiguousMappings.second) {
                mappings.push(new Mapping(srcNode.id, dstNode.id));
            }
        }
        return mappings;
    }

    ambiguousMappingsComparator(
        m1: Pair<Set<AstNode>>,
        m2: Pair<Set<AstNode>>,
        metrics: Map<NodeId, TreeMetrics>
    ): number {
        const s1 = Math.max(...[...m1.first].map(node => metrics.get(node.id)!.size));
        const s2 = Math.max(...[...m2.first].map(node => metrics.get(node.id)!.size));
        return s2 - s1;
    }


    private synchronize() {
        while (
            (!this.srcTreePQ.isEmpty() && !this.dstTreePQ.isEmpty()) &&
            this.srcTreePQ.peek()?.height !== this.dstTreePQ.peek()?.height

        ) {
            const srcTop = this.srcTreePQ.peek()!;
            const dstTop = this.dstTreePQ.peek()!;
            if (srcTop.height < dstTop.height) {
                const srcNode = this.srcTree.nodes.get(srcTop.nodeId)!;
                this.AddChildrenToQueue(srcNode, this.srcTreePQ, this.srcMetrics);

                this.srcTreePQ.poll();
            } else {
                const newNode = this.dstTree.nodes.get(dstTop.nodeId)!;
                this.AddChildrenToQueue(newNode, this.dstTreePQ, this.dstMetrics);
                this.dstTreePQ.poll();
            }
        }
        if (this.srcTreePQ.isEmpty() || this.dstTreePQ.isEmpty()) {
            this.dstTreePQ = new FastPriorityQueue<pqType>();
            this.srcTreePQ = new FastPriorityQueue<pqType>();
            return false;
        }
        return true;



    }


}