import FastPriorityQueue from "fastpriorityqueue";
import type { AstNode, BragiAST, NodeId } from "./types";
import { MappingStore } from "./types/GumTree/GumTree";
import { HashBasedMapper, Pair } from "./types/GumTree/HashBasedMapper";
import { TreeMetricComputer } from "./types/GumTree/TreeMetricComputer";

export type pqType = {
    nodeId: string,
    height: number
};

export class GumTreeTopDown{

    private srcTree: BragiAST;
    private dstTree: BragiAST;
    private srcTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    private dstTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    private srcMetrics: TreeMetricComputer = new TreeMetricComputer();
    private dstMetrics: TreeMetricComputer = new TreeMetricComputer();
    private mapping: MappingStore;

    constructor(srcTree: BragiAST, dstTree: BragiAST){
        this.srcTree = srcTree;
        this.dstTree = dstTree;
        this.mapping = new MappingStore(srcTree, dstTree);
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
            const height = metricComputer.getMetrics().get(node.id)!.height

            if (!this.IsInQueue({ nodeId, height }, PQ)) {
                PQ.add({
                    nodeId,
                    height
                });
            }

        }
    }

    private removeNodeAndDesendantsFromQueue(PQ: FastPriorityQueue<pqType>, heightMap: Map<NodeId, number>, tree: BragiAST, node?: AstNode,) {
        if (!node) return;
        const query = { nodeId: node.id, height: heightMap.get(node.id)! };
        if (this.IsInQueue(query, PQ)) {
            PQ.removeOne(node => node.nodeId === query.nodeId && node.height === query.height);
            const children = (node.type === "text") ? node.word : node.childrenIds;
            for (const id of children) {
                this.removeNodeAndDesendantsFromQueue(PQ, heightMap, tree, tree.nodes.get(id));
            }
        }
    }

    private addNodeToPQ(PQ: FastPriorityQueue<pqType>, tree: BragiAST, metricComputer: TreeMetricComputer, nodeId: NodeId){
        const node = tree.nodes.get(nodeId);
        if(!node) return;

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

        while(this.synchronize()){
            let localHashMappings = new HashBasedMapper(this.srcTree, this.dstTree, this.srcMetrics, this.dstMetrics);
            this.srcTreePQ.poll();
            this.dstTreePQ.poll();
            localHashMappings.addSrcNodesFromQueue(this.srcTreePQ);
            localHashMappings.addDstNodesFromQueue(this.dstTreePQ);

            localHashMappings.unique().forEach((pair)=>{
                
                this.mapping.addMappingRecursively(
                    pair.first.values().next().value!.id,
                    pair.second.values().next().value!.id
                );
            });

            localHashMappings.ambiguous().forEach((pair)=> {ambiguousMappings.push(pair)});

            localHashMappings.unmapped().forEach((pair)=>{
                pair.first.forEach((srcNode)=>{
                    this.AddChildrenToQueue(srcNode, this.srcTreePQ, this.srcMetrics);
                });

                pair.second.forEach((dstNode)=>{
                    this.AddChildrenToQueue(dstNode, this.dstTreePQ, this.dstMetrics);
                });
            })
        }

        return this.mapping;

    }


    private synchronize(){
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
                    this.AddChildrenToQueue(newNode, this.dstTreePQ, this.srcMetrics);
                    this.dstTreePQ.poll();
                }
            }
        if(this.srcTreePQ.isEmpty() || this.dstTreePQ.isEmpty()){
            this.dstTreePQ = new FastPriorityQueue<pqType>();
            this.srcTreePQ = new FastPriorityQueue<pqType>();
            return false;
        }
        return true;

        

        }
    

}