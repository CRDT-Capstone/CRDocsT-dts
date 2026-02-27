import FastPriorityQueue from "fastpriorityqueue";
import { AstNode, BragiAST, NodeId } from "./types";


//TODO: THERE IS PROBABLY A MORE BEST EFFORT WAY OF DOING THE EQUAL MAPPING THING


export class ASTMapping {
    private oldTree: BragiAST;
    private newTree: BragiAST;
    private newMappedTree: BragiAST;

    constructor(oldTree: BragiAST, newTree: BragiAST) {
        this.oldTree = oldTree;
        this.newTree = newTree;
        this.newMappedTree = structuredClone(newTree);
    }

    private isEqual(nodeA?: AstNode, nodeB?: AstNode) {
        if (!nodeA || !nodeB) return false;
        return (
            nodeA.parentId === nodeB.parentId &&
            nodeA.text === nodeB.text &&
            nodeA.type === nodeB.type
        );
    }

    private getChildNodeThatIsEqualWithChildrenId(oldChildNode: AstNode, newNode: AstNode): AstNode | undefined {
        //Can possibly do this in a more efficient way
        for (const Id of newNode.childrenIds) {
            const newChildNode = this.newMappedTree.nodes.get(Id);
            if (this.isEqual(oldChildNode, newChildNode)) return newChildNode;
        }
        return undefined;
    }

    private getChildNodeThatIsEqualWithWordId(oldChildNode: AstNode, newNode: AstNode): AstNode | undefined {
        if (newNode.type !== "text") return;

        for (const Id of newNode.word) {

            const newChildNode = this.newMappedTree.nodes.get(Id);
            if (this.isEqual(oldChildNode, newChildNode)) return newChildNode;
        }
        return undefined;
    }

    private changeChildrenParentId(nodeA: AstNode, newParentId: string, tree: BragiAST) {
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

    private mapNodeToOldIds(oldTreeNode: AstNode, newTreeNode: AstNode | undefined) {
        if (!newTreeNode) return;
        const oldId = oldTreeNode.id;
        const removedId = newTreeNode.id;
        this.newMappedTree.nodes.delete(removedId);
        newTreeNode.id = oldId; //change the Id of this node to the one in the old tree
        this.changeChildrenParentId(newTreeNode, oldId, this.newMappedTree);
        this.newMappedTree.nodes.set(oldId, newTreeNode);

        if (oldTreeNode.type === "text" && newTreeNode.type === "text") {
            //this should ideally be the same 
            //i.e. when oldTreeNode is text, then newTreeNode should be text
            //And if it's not then it's fine
            //Something was deleted and we don't need it in our new mapped tree

            this.handleTextNodes(oldTreeNode, newTreeNode);
        }
        const newChildrenIds = new Set(newTreeNode.childrenIds);
        for (const id of oldTreeNode.childrenIds) {
            const oldChildNode = this.oldTree.nodes.get(id)!;//this will definitely exist;
            const newChildNode = this.getChildNodeThatIsEqualWithChildrenId(oldChildNode, newTreeNode);



            if (newChildNode) {
                newChildrenIds.delete(newChildNode.id);
                this.mapNodeToOldIds(oldChildNode, newChildNode);
                newChildrenIds.add(newChildNode.id);
            }
        }

        newTreeNode.childrenIds = Array.from(newChildrenIds); //change the children Ids

    }



    private handleTextNodes(oldTreeNode: AstNode, newTreeNode: AstNode) {
        if (oldTreeNode.type !== "text" || newTreeNode.type !== "text") return;

        const newWordIds = new Set(newTreeNode.word);


        for (const id of oldTreeNode.word) {
            const oldChildNode = this.oldTree.nodes.get(id)!;
            const newChildNode = this.getChildNodeThatIsEqualWithWordId(oldChildNode, newTreeNode);

            if (newChildNode) {
                newWordIds.delete(newChildNode.id);
                this.mapNodeToOldIds(oldChildNode, newChildNode);

                newWordIds.add(newChildNode.id);
            }


        }

        newTreeNode.word = Array.from(newWordIds);
    }

    /**
     * This function returns a new tree that is the old tree but plus the nodes that were added to form the new tree.
     * We need to do this because ParseCST creates new Ids every time it runs. So we need to reconcile those Ids first before
     * we can begin diffing 
     */
    GetNewMappedTree = () => {

        const oldRoot = this.oldTree.nodes.get(this.oldTree.rootId)!;
        const newRoot = this.newMappedTree.nodes.get(this.newMappedTree.rootId)!;
        this.mapNodeToOldIds(oldRoot, newRoot);
        this.newMappedTree.rootId = newRoot.id;
        return this.newMappedTree;
    }


    



}