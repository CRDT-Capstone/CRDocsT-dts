import { BragiAST, AstNode, NodeId } from "./types";

const isEqual = (nodeA?: AstNode, nodeB?: AstNode) => {
    if (!nodeA || !nodeB) return false;
    return (
        nodeA.parentId === nodeB.parentId &&
        nodeA.text === nodeB.text &&
        nodeA.type === nodeB.type
    );
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

const changeChildrenParentId = (nodeA: AstNode, newParentId: string, tree: BragiAST)=>{
    for(const id of nodeA.childrenIds){
        const node = tree.nodes.get(id);
        if(!node) continue; //we shouldn't have this happen 
        node.parentId = newParentId;
    }
    if(nodeA.type === "text"){
        for(const id of nodeA.word){
            const node = tree.nodes.get(id);
            if(!node) continue;
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
    const newNodes = new Map<NodeId, AstNode>();
    const visited = new Set();

    function dfs(oldTreeNode: AstNode, newTreeNode: AstNode | undefined) {
        if (!newTreeNode) return;
        // if(visited.has(newTreeNode)) return;
        // visited.add(newTreeNode);


        const oldId = oldTreeNode.id;

        if (!newTreeNode) return; //if the node doesn't exist, we can return and continue walking through the tree

        newTreeNode.id = oldId; //change the Id of this node to the one in the old tree
        changeChildrenParentId(newTreeNode, oldId, newMappedTree);
        newNodes.set(oldId, newTreeNode);

        if (oldTreeNode.type === "text" && newTreeNode.type === "text") {
            //this should ideally be the same 
            //i.e. when oldTreeNode is text, then newTreeNode should be text
            //And if it's not then it's fine
            //Something was deleted and we don't need it in our new mapped tree

            const oldWordIds = oldTreeNode.word;

            const newWordIds: string[] = [];

            for (const id of oldWordIds) {
                const oldChildNode = oldTree.nodes.get(id)!;
                const newChildNode = getChildNodeThatIsEqualWithWordId(oldChildNode, newTreeNode, newMappedTree);
                dfs(oldChildNode, newChildNode);
                if (newChildNode) newWordIds.push(newChildNode.id);
            }
            newTreeNode.word = newWordIds;
        }

        const newChildrenIds = []; //need to keep track of the new children Ids
        for (const id of oldTreeNode.childrenIds) {
            const oldChildNode = oldTree.nodes.get(id)!;//this will definitely exist;
            const newChildNode = getChildNodeThatIsEqualWithChildrenId(oldChildNode, newTreeNode, newMappedTree);


            dfs(oldChildNode, newChildNode);
            if (newChildNode) newChildrenIds.push(newChildNode.id);
        }
        newTreeNode.childrenIds = newChildrenIds; //change the children Ids
    }

    const oldRoot = oldTree.nodes.get(oldTree.rootId)!;
    const newRoot = newMappedTree.nodes.get(newMappedTree.rootId)!;
    dfs(oldRoot, newRoot);
    newMappedTree.nodes = newNodes;
    newMappedTree.rootId = newRoot.id;

    return newMappedTree;
}