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
    const newNodes = new Map<NodeId, AstNode>();

    function recursivelyAddToNewNodes(node: AstNode | undefined) {
        if (!node) return;
        if(!newNodes.has(node.id)) newNodes.set(node.id, node);
        for (const id of node.childrenIds) {
            const next = newMappedTree.nodes.get(id);
            if (next) {
                newNodes.set(id, next);
                recursivelyAddToNewNodes(next)
            }

        }
    }

    function handleTextNodes(oldTreeNode: AstNode, newTreeNode: AstNode) {
        if (oldTreeNode.type !== "text" || newTreeNode.type !== "text") return;

        const newWordIds: string[] = [];
        let oldWordIds = structuredClone(newTreeNode.word);


        for (const id of oldTreeNode.word) {
            const oldChildNode = oldTree.nodes.get(id)!;
            const newChildNode = getChildNodeThatIsEqualWithWordId(oldChildNode, newTreeNode, newMappedTree);

            if (newChildNode) {
                oldWordIds = oldWordIds.filter((wordId) => wordId !== newChildNode.id);
                dfs(oldChildNode, newChildNode);

                newWordIds.push(newChildNode.id);
            }


        }

        if (newTreeNode.word.length > oldTreeNode.word.length) {
            //if we have new words 
            //Jut append them to the newWordIds
            newWordIds.concat(oldWordIds);
        }
        newTreeNode.word = newWordIds;
    }


    function dfs(oldTreeNode: AstNode, newTreeNode: AstNode | undefined) {
        if (!newTreeNode) return;
        const oldId = oldTreeNode.id;


        newTreeNode.id = oldId; //change the Id of this node to the one in the old tree
        changeChildrenParentId(newTreeNode, oldId, newMappedTree);
        newNodes.set(oldId, newTreeNode);

        if (oldTreeNode.type === "text" && newTreeNode.type === "text") {
            //this should ideally be the same 
            //i.e. when oldTreeNode is text, then newTreeNode should be text
            //And if it's not then it's fine
            //Something was deleted and we don't need it in our new mapped tree

            handleTextNodes(oldTreeNode, newTreeNode);
        }

        let oldChildrenId = structuredClone(newTreeNode.childrenIds);
        const newChildrenIds = []; //need to keep track of the new children Ids
        for (const id of oldTreeNode.childrenIds) {
            const oldChildNode = oldTree.nodes.get(id)!;//this will definitely exist;
            const newChildNode = getChildNodeThatIsEqualWithChildrenId(oldChildNode, newTreeNode, newMappedTree);


            
            if (newChildNode){
                oldChildrenId = oldChildrenId.filter((nodeId)=> nodeId!== newChildNode.id)
                dfs(oldChildNode, newChildNode);
                newChildrenIds.push(newChildNode.id);
            } 
        }

        if(oldChildrenId.length > 0){
            //we had some nodes that were in the newTree but weren't in the old tree
            newChildrenIds.concat(oldChildrenId);
            for(const Id of oldChildrenId){
                const childNode = newMappedTree.nodes.get(Id);
                recursivelyAddToNewNodes(childNode);
            }
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