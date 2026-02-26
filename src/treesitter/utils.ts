import FastPriorityQueue from "fastpriorityqueue";
import { BragiAST, AstNode, NodeId } from "./types";


type pqType = {
    nodeId: string,
    height: number
};


const isEqual = (nodeA?: AstNode, nodeB?: AstNode) => {
    if (!nodeA || !nodeB) return false;
    return (
        nodeA.parentId === nodeB.parentId &&
        nodeA.text === nodeB.text &&
        nodeA.type === nodeB.type
    );
}

const HeightfiyTree = (tree: BragiAST) => {
    //Please help with a better name if you have one

    const nodeHeightMap = new Map<NodeId, number>();

    function dfs(node?: AstNode) {
        if (!node) return -1;
        let height = 0;
        const childIds = node.type === "text" ? node.word : node.childrenIds;

        for (const id of childIds) {
            const newNode = tree.nodes.get(id);
            height = Math.max(height, 1 + dfs(newNode));
        }

        nodeHeightMap.set(node.id, height);
        return height;
    }

    const root = tree.nodes.get(tree.rootId);
    dfs(root);
    return nodeHeightMap;
}

function IsInQueue(entry: pqType, pq: FastPriorityQueue<pqType>) {
    let isIn = false;
    pq.forEach((node) => {
        if (node.height === entry.height && node.nodeId === entry.nodeId) {
            isIn = true;
        }
    });
    return isIn;
}

function AddChildToQueue(heightMap: Map<NodeId, number>, node: AstNode, PQ: FastPriorityQueue<pqType>) {
    const childrenIds = (node.type === "text") ? node.word : node.childrenIds;
    for (const nodeId of childrenIds) {
        const height = heightMap.get(nodeId)!;
        if (!IsInQueue({ nodeId, height }, PQ)) {
            PQ.add({
                nodeId,
                height
            });
        }

    }
}

function removeNodeAndDesendantsFromQueue(PQ: FastPriorityQueue<pqType>, heightMap: Map<NodeId, number>, tree: BragiAST, node?: AstNode, ){
    if(!node) return;
    const query = { nodeId: node.id, height: heightMap.get(node.id)!};
    if(IsInQueue(query, PQ)){
        PQ.remove(query);
        const children = (node.type === "text") ? node.word : node.childrenIds;
        for(const id of children){
            removeNodeAndDesendantsFromQueue(PQ, heightMap, tree, tree.nodes.get(id));
        }
    }
}



const topDown = (oldTree: BragiAST, newTree: BragiAST) => {


    const oldTreeHeightMap = HeightfiyTree(oldTree);
    const newTreeHeightMap = HeightfiyTree(newTree);


    const oldTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);
    const newTreePQ = new FastPriorityQueue((a: pqType, b: pqType) => a.height > b.height);

    oldTreePQ.add({
        nodeId: oldTree.rootId,
        height: oldTreeHeightMap.get(oldTree.rootId)!
    });

    newTreePQ.add({
        nodeId: newTree.rootId,
        height: newTreeHeightMap.get(newTree.rootId)!
    });

    const mappings: [string, string][] = [];

    while (!oldTreePQ.isEmpty() && !newTreePQ.isEmpty()) {
        const oldTop = oldTreePQ.peek()!;
        const newTop = newTreePQ.peek()!;
        const maxHeight = newTop.height;
        if (oldTop.height !== newTop.height) {
            if (oldTop.height < newTop.height) {
                oldTreePQ.forEach((node, index) => {
                    if (node.height === maxHeight) {
                        const oldNode = oldTree.nodes.get(node.nodeId)!;
                        AddChildToQueue(oldTreeHeightMap, oldNode, oldTreePQ);
                    }
                });
                oldTreePQ.poll();
            } else {
                newTreePQ.forEach((node, index) => {
                    if (node.height === maxHeight) {
                        const newNode = newTree.nodes.get(node.nodeId)!;
                        AddChildToQueue(newTreeHeightMap, newNode, newTreePQ);
                    }
                });
                newTreePQ.poll();
            }
            continue;
        }


        const oldToNewPairings = new Map<NodeId, NodeId[]>();
        const newToOldPairings = new Map<NodeId, NodeId[]>();

        oldTreePQ.forEach((oldPQEntry, index) => {
            if (oldPQEntry.height === maxHeight) {
                newTreePQ.forEach((newPQEntry, index) => {
                    if (newPQEntry.height === maxHeight) {
                        const oldNode = oldTree.nodes.get(oldPQEntry.nodeId)!;
                        const newNode = newTree.nodes.get(newPQEntry.nodeId)!;

                        if (isIsomorphic(oldTree, newTree, oldNode, newNode)) {

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
                    const oldNode = oldTree.nodes.get(oldNodeId);
                    const newNode = newTree.nodes.get(newNodeId);
                    addToMapping(oldTree, newTree, mappings, oldNode, newNode);


                    //remove descendants from the queue
                    removeNodeAndDesendantsFromQueue(oldTreePQ, oldTreeHeightMap, oldTree, oldTree.nodes.get(oldNodeId));

                    removeNodeAndDesendantsFromQueue(newTreePQ, newTreeHeightMap, newTree, newTree.nodes.get(newNodeId));
                }
            } else {

                AddChildToQueue(oldTreeHeightMap, oldTree.nodes.get(oldNodeId)!, oldTreePQ);
                oldTreePQ.remove({
                    nodeId: oldNodeId, 
                    height: oldTreeHeightMap.get(oldNodeId)!
                })
                for(const newNodeId of oldToNewPairings.get(oldNodeId)!){
                    AddChildToQueue(newTreeHeightMap, newTree.nodes.get(newNodeId)!, newTreePQ);
                }


            }
        }
    }

    return mappings;

}


export const isIsomorphic = (treeA: BragiAST, treeB: BragiAST, nodeA?: AstNode, nodeB?: AstNode): boolean => {
    if (!nodeA || !nodeB) return false;

    if (
        (nodeA.type !== nodeB.type) ||
        (nodeA.text !== nodeB.text) ||
        (nodeA.childrenIds.length !== nodeB.childrenIds.length)
    ) return false;

    if(
        (nodeA.type === "text" && nodeB.type === "text") &&
        (nodeA.word.length !== nodeB.word.length)
    ) return false;


    let isIso = true;

    for (let i = 0; i < nodeA.childrenIds.length; ++i) {
        const id_A = nodeA.childrenIds[i];
        const newNodeA = treeA.nodes.get(id_A);

        const id_B = nodeB.childrenIds[i];
        const newNodeB = treeB.nodes.get(id_B);

        isIso = isIso && isIsomorphic(treeA, treeB, newNodeA, newNodeB);
    }

    //we are assuming words and childrenIds are going to be disjoint
    if (nodeA.type === "text" && nodeB.type === "text") {
        for (let i = 0; i < nodeA.word.length; ++i) {
            const id_A = nodeA.word[i];
            const newNodeA = treeA.nodes.get(id_A);

            const id_B = nodeB.word[i];
            const newNodeB = treeB.nodes.get(id_B);

            isIso = isIso && isIsomorphic(treeA, treeB, newNodeA, newNodeB);
        }

    }


    return isIso;


}

function addToMapping(treeA: BragiAST, treeB: BragiAST, mapping: [string, string][], nodeA?: AstNode, nodeB?: AstNode) {
    if (!nodeA || !nodeB) return;
    mapping.push([nodeA.id, nodeB.id]);

    if (nodeA.type === "text" && nodeB.type === "text") {
        if (nodeA.word.length !== nodeB.word.length) throw Error("This shouldn't be happening because they're isomorphic!!");

        for (let i = 0; i < nodeA.word.length; ++i) {
            const newNodeA = treeA.nodes.get(nodeA.word[i]);
            const newNodeB = treeB.nodes.get(nodeB.word[i]);
            addToMapping(treeA, treeB, mapping, newNodeA, newNodeB);
        }
    } else if (nodeA.type !== "text" && nodeB.type !== "text") {
        if (nodeA.childrenIds.length !== nodeB.childrenIds.length) throw Error("This shouldn't be happening because they're isomorphic!!");

        for (let i = 0; i < nodeA.childrenIds.length; ++i) {
            const newNodeA = treeA.nodes.get(nodeA.childrenIds[i]);
            const newNodeB = treeB.nodes.get(nodeB.childrenIds[i]);
            addToMapping(treeA, treeB, mapping, newNodeB, newNodeA);
        }
    } else {
        throw Error("This should not be happening because of isomorphism!")
    }
}

const getChildNodeThatIsEqualWithChildrenId = (oldChildNode: AstNode, newNode: AstNode, newTree: BragiAST) => {
    //Can possibly do this in a more efficient way
    for (const Id of newNode.childrenIds) {
        const newChildNode = newTree.nodes.get(Id);
        if (isEqual(oldChildNode, newChildNode)) return newChildNode;
    }
    return undefined;
}

const getChildNodeThatIsEqualWithWordId = (oldChildNode: AstNode, newNode: AstNode, newTree: BragiAST) => {
    if (newNode.type !== "text") return;

    for (const Id of newNode.word) {

        const newChildNode = newTree.nodes.get(Id);
        if (isEqual(oldChildNode, newChildNode)) return newChildNode;
    }
    return undefined;
}

const changeChildrenParentId = (nodeA: AstNode, newParentId: string, tree: BragiAST) => {
    for (const id of nodeA.childrenIds) {
        const node = tree.nodes.get(id);
        if (!node) continue; //we shouldn't have this happen 
        node.parentId = newParentId;
    }
    if (nodeA.type === "text") {
        for (const id of nodeA.word) {
            const node = tree.nodes.get(id);
            if (!node) continue;
            node.parentId = newParentId;
        }
    }
}




/**
 * This function returns a new tree that is the old tree but plus the nodes that were added to form the new tree.
 * We need to do this because ParseCST creates new Ids every time it runs. So we need to reconcile those Ids first before
 * we can begin diffing 
 */
export const GetNewMappedTree = (oldTree: BragiAST, newTree: BragiAST) => {
    const newMappedTree = structuredClone(newTree);


    function handleTextNodes(oldTreeNode: AstNode, newTreeNode: AstNode) {
        if (oldTreeNode.type !== "text" || newTreeNode.type !== "text") return;

        const newWordIds = new Set(newTreeNode.word);


        for (const id of oldTreeNode.word) {
            const oldChildNode = oldTree.nodes.get(id)!;
            const newChildNode = getChildNodeThatIsEqualWithWordId(oldChildNode, newTreeNode, newMappedTree);

            if (newChildNode) {
                newWordIds.delete(newChildNode.id);
                dfs(oldChildNode, newChildNode);

                newWordIds.add(newChildNode.id);
            }


        }

        newTreeNode.word = Array.from(newWordIds);
    }


    function dfs(oldTreeNode: AstNode, newTreeNode: AstNode | undefined) {
        if (!newTreeNode) return;
        const oldId = oldTreeNode.id;
        const removedId = newTreeNode.id;
        newMappedTree.nodes.delete(removedId);
        newTreeNode.id = oldId; //change the Id of this node to the one in the old tree
        changeChildrenParentId(newTreeNode, oldId, newMappedTree);
        newMappedTree.nodes.set(oldId, newTreeNode);

        if (oldTreeNode.type === "text" && newTreeNode.type === "text") {
            //this should ideally be the same 
            //i.e. when oldTreeNode is text, then newTreeNode should be text
            //And if it's not then it's fine
            //Something was deleted and we don't need it in our new mapped tree

            handleTextNodes(oldTreeNode, newTreeNode);
        }
        const newChildrenIds = new Set(oldTreeNode.childrenIds);
        for (const id of oldTreeNode.childrenIds) {
            const oldChildNode = oldTree.nodes.get(id)!;//this will definitely exist;
            const newChildNode = getChildNodeThatIsEqualWithChildrenId(oldChildNode, newTreeNode, newMappedTree);



            if (newChildNode) {
                newChildrenIds.delete(newChildNode.id);
                dfs(oldChildNode, newChildNode);
                newChildrenIds.add(newChildNode.id);
            }
        }

        newTreeNode.childrenIds = Array.from(newChildrenIds); //change the children Ids

    }

    const oldRoot = oldTree.nodes.get(oldTree.rootId)!;
    const newRoot = newMappedTree.nodes.get(newMappedTree.rootId)!;
    dfs(oldRoot, newRoot);
    newMappedTree.rootId = newRoot.id;

    return newMappedTree;
}