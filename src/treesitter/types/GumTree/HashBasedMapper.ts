import FastPriorityQueue from "fastpriorityqueue";
import { AstNode, BragiAST, NodeId } from "../AST"
import { TreeMetricComputer } from "./TreeMetricComputer";
import { pqType } from "../../GumTreeTopDown";

export type Pair<T> = {
    first: T,
    second: T
}

export class HashBasedMapper { 
    private readonly mapping: Map<number, Pair<Set<AstNode>>>;
    private srcTree: BragiAST;
    private dstTree: BragiAST;

    private srcMetrics: TreeMetricComputer;
    private dstMetrics: TreeMetricComputer;

    constructor(srcTree: BragiAST, dstTree:BragiAST, srcMetrics: TreeMetricComputer, dstMetrics: TreeMetricComputer){
        this.srcTree = srcTree;
        this.dstTree = dstTree;
        this.mapping = new Map();
        this.srcMetrics = srcMetrics;
        this.dstMetrics = dstMetrics;
    }

    private putInMappingIfAbsent(hash: number, pair: Pair<Set<AstNode>>){
        if(this.mapping.has(hash)) return;
        this.mapping.set(hash, pair);
    }

    addSrcNodesFromQueue(srcPQ: FastPriorityQueue<pqType>){
        srcPQ.forEach((value, index)=>{
            const node = this.srcTree.nodes.get(value.nodeId)!;
            this.addSrcNode(node);
        })
    }


    addDstNodesFromQueue(dstPQ: FastPriorityQueue<pqType>){
        dstPQ.forEach((value, index)=>{
            const node = this.dstTree.nodes.get(value.nodeId)!;
            this.addDstNode(node);
        })
    }



    addSrcNode(node: AstNode){
        const nodeMetrics = this.srcMetrics.getMetrics().get(node.id)!;
        this.putInMappingIfAbsent(nodeMetrics.hash, {
            first: new Set(),
            second: new Set()
        });
        this.mapping.get(nodeMetrics.hash)!.first.add(node);
    }

    addDstNode(node: AstNode){
        const nodeMetrics = this.dstMetrics.getMetrics().get(node.id)!;
        this.putInMappingIfAbsent(nodeMetrics.hash, {
            first: new Set(),
            second: new Set()
        });
        this.mapping.get(nodeMetrics.hash)!.second.add(node);
    }

    unique(){
        return Array.from(this.mapping.values()).filter((pair)=> pair.first.size === 1 && pair.second.size === 1);
    }

    ambiguous(){
        return Array.from(this.mapping.values()).filter((pair)=> (pair.first.size > 1 && pair.second.size >= 1) || (pair.first.size >= 1 && pair.second.size > 1));
    }

    unmapped(){
        return Array.from(this.mapping.values()).filter((pair)=> pair.first.size === 0 || pair.second.size === 0);
    }

    isSrcNodeMapped(srcNode: AstNode){
        const nodeMetrics = this.srcMetrics.getMetrics().get(srcNode.id)!;
        return this.mapping.get(nodeMetrics.hash)!.second.size > 0;
    }

    isDstNodeMapped(dstNode: AstNode){
        const nodeMetrics = this.dstMetrics.getMetrics().get(dstNode.id)!;
        return this.mapping.get(nodeMetrics.hash)!.first.size > 0;
    }
    
}