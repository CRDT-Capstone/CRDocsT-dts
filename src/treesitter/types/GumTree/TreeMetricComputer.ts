import { allChildIds, AstNode, BragiAST, NodeId } from "../AST";
import { TreeMetrics } from "./TreeMetrics";
import hash from "object-hash";


export class TreeMetricComputer {
    static readonly ENTER: string = "enter";
    static readonly LEAVE: string = "leave";
    static readonly BASE: number = 33;

    private metrics = new Map<NodeId, TreeMetrics>();

    currentDepth = 0;
    currentPosition = 0;

    buildMetrics(tree: BragiAST, node?: AstNode){
        if(!node) return;
        this.startNode(tree, node);
        const children = allChildIds(tree, node);
        for(const id of children){
            const newNode = tree.nodes.get(id)!;
            this.buildMetrics(tree, newNode);
        }
        this.endTree(tree, node);
    }

    getMetrics(){
        return this.metrics;
    }


    startNode(tree: BragiAST, node: AstNode) {
        const children = allChildIds(tree, node);
        if (children.length === 0)
            this.visitLeaf(node);
        else
            this.startInnerNode(node);
    }

    endTree(tree: BragiAST, node: AstNode) {
        const children = allChildIds(tree, node);
        if (children.length > 0)
            this.endInnerNode(tree, node);
    }

    startInnerNode(node: AstNode) {
        this.currentDepth++;
    }

    visitLeaf(node: AstNode) {
        this.metrics.set(node.id, new TreeMetrics(1, 0, TreeMetricComputer.leafHash(node), TreeMetricComputer.leafStructureHash(node), this.currentDepth, this.currentPosition));
        this.currentPosition++;
    }

    endInnerNode(tree: BragiAST, node: AstNode) {
        this.currentDepth--;
        let sumSize = 0;
        let maxHeight = 0;
        let currentHash = 0;
        let currentStructureHash = 0;

        const childrenIds = allChildIds(tree, node);
        for (const id of childrenIds) {
            const metrics = this.metrics.get(id)!;
            const exponent = 2 * sumSize + 1;
            currentHash += metrics.hash * TreeMetricComputer.hashFactor(exponent);
            currentStructureHash += metrics.structureHash * TreeMetricComputer.hashFactor(exponent);
            sumSize += metrics.size;
            if (metrics.height > maxHeight)
                maxHeight = metrics.height;
        }
        this.metrics.set(node.id, new TreeMetrics(
            sumSize + 1,
            maxHeight + 1,
            TreeMetricComputer.innerNodeHash(node, 2 * sumSize + 1, currentHash),
            TreeMetricComputer.innerNodeStructureHash(node, 2 * sumSize + 1, currentStructureHash),
            this.currentDepth, this.currentPosition));
        this.currentPosition++;
    }


    private static hashFactor(exponent: number): number {
        return TreeMetricComputer.fastExponentiation(TreeMetricComputer.BASE, exponent);
    }

    private static fastExponentiation(base: number, exponent: number): number {
        if (exponent === 0) return 1;
        if (exponent === 1) return base;

        let result = 1;
        while (exponent > 0) {
            if ((exponent & 1) !== 0) result *= base;

            exponent >>= 1;
            base *= base;
        }
        return result;
    }

    private static innerNodeHash(node: AstNode, size: number, middleHash: number): number {
        return parseInt(hash({ type: node.type, text: node.text, action: TreeMetricComputer.ENTER }), 16)
            + middleHash
            + parseInt(hash({ type: node.type, text: node.text, action: TreeMetricComputer.LEAVE }), 16)
            * TreeMetricComputer.hashFactor(size);
    }

    private static innerNodeStructureHash(node: AstNode, size: number, middleHash: number) {
        return parseInt(hash({ type: node.type, action: TreeMetricComputer.ENTER }), 16)
            + middleHash
            + parseInt(hash({ type: node.type, action: TreeMetricComputer.LEAVE }), 16) * TreeMetricComputer.hashFactor(size);
    }

    private static leafHash(node: AstNode): number {
        return TreeMetricComputer.innerNodeHash(node, 1, 0);
    }

    private static leafStructureHash(node: AstNode): number {
        return TreeMetricComputer.innerNodeStructureHash(node, 1, 0);
    }
}