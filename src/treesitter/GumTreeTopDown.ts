import FastPriorityQueue from "fastpriorityqueue";
import { AstNode, BragiAST, NodeId } from "./types";

export type pqType = {
    nodeId: string,
    height: number
};

export class GumTreeTopDown{

    private oldTree: BragiAST;
    private newTree: BragiAST;
    private oldTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    private newTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    private oldTreeHeightMap = new Map<NodeId, number>();
    private newTreeHeightMap = new Map<NodeId, number>();
    private mapping: [string, string][] = [];

    constructor(oldTree: BragiAST, newTree: BragiAST){
        this.oldTree = oldTree;
        this.newTree = newTree;
    } 
    //TOP-DOWN PHASE
    private HeightfiyTrees = () => {
        //Please help with a better name if you have one

        function dfs(tree: BragiAST, nodeHeightMap: Map<NodeId, number>, node?: AstNode) {
            if (!node) return -1;
            let height = 0;
            const childIds = node.type === "text" ? node.word : node.childrenIds;

            for (const id of childIds) {
                const newNode = tree.nodes.get(id);
                height = Math.max(height, 1 + dfs(tree, nodeHeightMap, newNode));
            }

            nodeHeightMap.set(node.id, height);
            return height;
        }

        const oldRoot = this.oldTree.nodes.get(this.oldTree.rootId);
        const newRoot = this.newTree.nodes.get(this.newTree.rootId);

        dfs(this.oldTree, this.oldTreeHeightMap, oldRoot);
        dfs(this.newTree, this.newTreeHeightMap, newRoot);
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

    private AddChildToQueue(heightMap: Map<NodeId, number>, node: AstNode, PQ: FastPriorityQueue<pqType>) {
        const childrenIds = (node.type === "text") ? node.word : node.childrenIds;
        for (const nodeId of childrenIds) {
            const height = heightMap.get(nodeId)!;
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



    topDown = () => {
        this.HeightfiyTrees();

        this.oldTreePQ.add({
            nodeId: this.oldTree.rootId,
            height: this.oldTreeHeightMap.get(this.oldTree.rootId)!
        });

        this.newTreePQ.add({
            nodeId: this.newTree.rootId,
            height: this.newTreeHeightMap.get(this.newTree.rootId)!
        });

        while (!this.oldTreePQ.isEmpty() && !this.newTreePQ.isEmpty()) {
            const oldTop = this.oldTreePQ.peek()!;
            const newTop = this.newTreePQ.peek()!;
            const maxHeight = newTop.height;
            if (oldTop.height !== newTop.height) {
                if (oldTop.height < newTop.height) {
                    const oldNode = this.oldTree.nodes.get(oldTop.nodeId)!;
                    this.AddChildToQueue(this.oldTreeHeightMap, oldNode, this.oldTreePQ);

                    this.oldTreePQ.poll();
                } else {
                    const newNode = this.newTree.nodes.get(newTop.nodeId)!;
                    this.AddChildToQueue(this.newTreeHeightMap, newNode, this.newTreePQ);
                    this.newTreePQ.poll();
                }
                continue;
            }


            const oldToNewPairings = new Map<NodeId, NodeId[]>();
            const newToOldPairings = new Map<NodeId, NodeId[]>();

            this.oldTreePQ.forEach((oldPQEntry, index) => {
                if (oldPQEntry.height === maxHeight) {
                    this.newTreePQ.forEach((newPQEntry, index) => {
                        if (newPQEntry.height === maxHeight) {
                            const oldNode = this.oldTree.nodes.get(oldPQEntry.nodeId)!;
                            const newNode = this.newTree.nodes.get(newPQEntry.nodeId)!;

                            if (this.isIsomorphic(oldNode, newNode)) {

                                const priorOldToNewPairings = oldToNewPairings.get(oldNode.id);
                                const priorNewToOldPairings = newToOldPairings.get(newNode.id);

                                if (priorOldToNewPairings) oldToNewPairings.set(oldNode.id, [...priorOldToNewPairings, newNode.id]);
                                else oldToNewPairings.set(oldNode.id, [newNode.id]);

                                if (priorNewToOldPairings) newToOldPairings.set(newNode.id, [...priorNewToOldPairings, oldNode.id]);
                                else newToOldPairings.set(newNode.id, [oldNode.id]);

                            }
                        }
                    });
                }

            });


            for (const [oldNodeId, pairing] of oldToNewPairings) {
                if (pairing.length === 1) {
                    const newNodeId = pairing[0];
                    const newNodePairing = newToOldPairings.get(newNodeId)!;
                    if (newNodePairing.length === 1) {
                        //unique match 
                        const oldNode = this.oldTree.nodes.get(oldNodeId);
                        const newNode = this.newTree.nodes.get(newNodeId);
                        this.addToMapping(oldNode, newNode);


                        //remove descendants from the queue
                        this.removeNodeAndDesendantsFromQueue(this.oldTreePQ, this.oldTreeHeightMap, this.oldTree, this.oldTree.nodes.get(oldNodeId));

                        this.removeNodeAndDesendantsFromQueue(this.newTreePQ, this.newTreeHeightMap, this.newTree, this.newTree.nodes.get(newNodeId));
                    }
                } else {

                    this.AddChildToQueue(this.oldTreeHeightMap, this.oldTree.nodes.get(oldNodeId)!, this.oldTreePQ);
                    let removeQuery = {
                        nodeId: oldNodeId,
                        height: this.oldTreeHeightMap.get(oldNodeId)!
                    };
                    this.oldTreePQ.removeOne((node) => node.nodeId === removeQuery.nodeId && node.height === removeQuery.height);
                    for (const newNodeId of oldToNewPairings.get(oldNodeId)!) {
                        this.AddChildToQueue(this.newTreeHeightMap, this.newTree.nodes.get(newNodeId)!, this.newTreePQ);
                        const newRemoveQuery = {
                            nodeId: newNodeId,
                            height: this.newTreeHeightMap.get(newNodeId)!
                        };
                       this.newTreePQ.removeOne((node) => node.nodeId === newRemoveQuery.nodeId && node.height === newRemoveQuery.height);
                    }


                }
            }

            const oldNodesToExpand: AstNode[] = [];

            this.oldTreePQ.forEach((node, index)=>{
                if(node.height === maxHeight){
                    const oldNode = this.oldTree.nodes.get(node.nodeId)!;
                    oldNodesToExpand.push(oldNode)
                }
            });

            for(const node of oldNodesToExpand){
                this.AddChildToQueue(this.oldTreeHeightMap, node, this.oldTreePQ);
                this.oldTreePQ.removeOne((entry)=> entry.height === this.oldTreeHeightMap.get(node.id)! && entry.nodeId === node.id);
            }

            const newNodesToExpand: AstNode[] = [];

            this.newTreePQ.forEach((node, index)=>{
                if(node.height === maxHeight){
                    const newNode = this.newTree.nodes.get(node.nodeId)!;
                    newNodesToExpand.push(newNode)
                }
            });

            for(const node of newNodesToExpand){
                this.AddChildToQueue(this.newTreeHeightMap, node, this.newTreePQ);
                this.newTreePQ.removeOne((entry)=> entry.height === this.newTreeHeightMap.get(node.id)! && entry.nodeId === node.id);
            }
        }

        return this.mapping;

    }


    private isIsomorphic = (nodeA?: AstNode, nodeB?: AstNode): boolean => {
        if (!nodeA || !nodeB) return false;

        if (
            (nodeA.type !== nodeB.type) ||
            (nodeA.text !== nodeB.text) ||
            (nodeA.childrenIds.length !== nodeB.childrenIds.length)
        ) return false;

        if (
            (nodeA.type === "text" && nodeB.type === "text") &&
            (nodeA.word.length !== nodeB.word.length)
        ) return false;


        let isIso = true;

        for (let i = 0; i < nodeA.childrenIds.length; ++i) {
            const id_A = nodeA.childrenIds[i];
            const newNodeA = this.oldTree.nodes.get(id_A);

            const id_B = nodeB.childrenIds[i];
            const newNodeB = this.newTree.nodes.get(id_B);

            isIso = isIso && this.isIsomorphic(newNodeA, newNodeB);
        }

        //we are assuming words and childrenIds are going to be disjoint
        if (nodeA.type === "text" && nodeB.type === "text") {
            for (let i = 0; i < nodeA.word.length; ++i) {
                const id_A = nodeA.word[i];
                const newNodeA = this.oldTree.nodes.get(id_A);

                const id_B = nodeB.word[i];
                const newNodeB = this.newTree.nodes.get(id_B);

                isIso = isIso && this.isIsomorphic(newNodeA, newNodeB);
            }

        }


        return isIso;


    }

    private addToMapping( nodeA?: AstNode, nodeB?: AstNode) {
        if (!nodeA || !nodeB) return;
        this.mapping.push([nodeA.id, nodeB.id]);

        if (nodeA.type === "text" && nodeB.type === "text") {
            if (nodeA.word.length !== nodeB.word.length) throw Error("This shouldn't be happening because they're isomorphic!!");

            for (let i = 0; i < nodeA.word.length; ++i) {
                const newNodeA = this.oldTree.nodes.get(nodeA.word[i]);
                const newNodeB = this.newTree.nodes.get(nodeB.word[i]);
                this.addToMapping(newNodeA, newNodeB);
            }
        } else if (nodeA.type !== "text" && nodeB.type !== "text") {
            if (nodeA.childrenIds.length !== nodeB.childrenIds.length) throw Error("This shouldn't be happening because they're isomorphic!!");

            for (let i = 0; i < nodeA.childrenIds.length; ++i) {
                const newNodeA = this.oldTree.nodes.get(nodeA.childrenIds[i]);
                const newNodeB = this.newTree.nodes.get(nodeB.childrenIds[i]);
                this.addToMapping(newNodeA, newNodeB);
            }
        } else {
            throw Error("This should not be happening because of isomorphism!");
        }
    }
}