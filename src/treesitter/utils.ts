import { BragiAST, AstNode } from "./types";

const isEqual = (nodeA?: AstNode, nodeB?: AstNode)=>{
    if(!nodeA || !nodeB) return false;
    return (
        nodeA.parentId === nodeB.parentId &&
        nodeA.text === nodeB.text &&
        nodeA.type === nodeB.type
    );
}

const changeChildrenParentId = (nodeA: AstNode, newParentId: string, tree: BragiAST)=>{
    for(const id of nodeA.childrenIds){
        const node = tree.nodes.get(id);
        if(!node) continue; //we shouldn't have this happen 
        node.parentId = newParentId;
    } 
}

const getChildNodeThatIsEqual = (oldChildNode: AstNode, newNode: AstNode, newTree: BragiAST)=>{
    //Can possibly do this in a more efficient way
    for(const Id of newNode.childrenIds){
        const newChildNode = newTree.nodes.get(Id);
        if(isEqual(oldChildNode, newChildNode)) return newChildNode;
    }
    return undefined;
}




/**
 * This function returns a new tree that is the old tree but plus the nodes that were added to form the new tree.
 * We need to do this because ParseCST creates new Ids every time it runs. So we need to reconcile those Ids first before
 * we can begin diffing 
 */
export const GetNewMappedTree = (oldTree: BragiAST, newTree: BragiAST)=>{
    const newMappedTree = structuredClone(newTree);
    const visited = new Set();
    
    function dfs(oldTreeNode: AstNode, newTreeNode: AstNode | undefined,  parentId: string | null = null){
        if(!newTreeNode) return;

        if(visited.has(oldTreeNode.id)) return;

        const oldId = oldTreeNode.id;
        visited.add(oldId);
        const node = newMappedTree.nodes.get(newTreeNode.id); //get the node that we want to change in the new mapped tree

        if(!node) return; //if the node doesn't exist, we can return and continue walking through the tree

        node.id = oldId; //change th Id of this node to the one in the old tree
        node.parentId = parentId; //change the parentId of this node

        //change the parentId of it's children 
        changeChildrenParentId(node, oldId, newMappedTree);

        for(const id of oldTreeNode.childrenIds){
            const oldChildNode = oldTree.nodes.get(id)!;//this will definitely exist;
            const newChildNode = getChildNodeThatIsEqual(oldChildNode, node, newMappedTree);
            dfs(oldChildNode, newChildNode, oldId);
        }
    }

    const oldRoot = oldTree.nodes.get(oldTree.rootId)!;
    const newRoot = newMappedTree.nodes.get(newMappedTree.rootId)!;
    dfs(oldRoot, newRoot);

    return newMappedTree;
}