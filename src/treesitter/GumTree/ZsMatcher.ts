import { AstNode, BragiAST, NodeId } from "../types/AST.js";
import { MappingStore } from "../types/GumTree.js";
import { TreeMetricComputer } from "./TreeMetricComputer.js";

class ZsTree {
    nodeCount: number;
    leafCount: number;
    llds: number[];
    labels: AstNode[];
    kr: number[];

    constructor(tree: BragiAST, root: AstNode, metrics: TreeMetricComputer) {
        this.nodeCount = metrics.getMetrics().get(root.id)!.size;
        this.leafCount = 0;
        this.llds = new Array(this.nodeCount).fill(0);
        this.labels = new Array(this.nodeCount);
        this.kr = [];

        let idx = 1;
        const tmpData = new Map<NodeId, number>();

        for (const node of ZsTree.postOrder(tree, root)) {
            tmpData.set(node.id, idx);
            this.setITree(idx, node);
            const firstLeaf = ZsTree.getFirstLeaf(tree, node);
            this.setLld(idx, tmpData.get(firstLeaf.id)!);
            const children = node.type === "text" ? node.word : node.childrenIds;
            if (children.length === 0) this.leafCount++;
            idx++;
        }

        this.setKeyRoots();
    }

    static getFirstLeaf(tree: BragiAST, node: AstNode): AstNode {
        let current = node;
        while (true) {
            const children = current.type === "text" ? current.word : current.childrenIds;
            if (children.length === 0) return current;
            current = tree.nodes.get(children[0])!;
        }
    }

    static *postOrder(tree: BragiAST, node: AstNode): Generator<AstNode> {
        const children = node.type === "text" ? node.word : node.childrenIds;
        for (const childId of children) {
            yield* ZsTree.postOrder(tree, tree.nodes.get(childId)!);
        }
        yield node;
    }

    setITree(i: number, node: AstNode) {
        this.labels[i - 1] = node;
        if (this.nodeCount < i) this.nodeCount = i;
    }

    setLld(i: number, lld: number) {
        this.llds[i - 1] = lld - 1;
        if (this.nodeCount < i) this.nodeCount = i;
    }

    isLeaf(i: number): boolean {
        return this.lld(i) === i;
    }

    lld(i: number): number {
        return this.llds[i - 1] + 1;
    }

    tree(i: number): AstNode {
        return this.labels[i - 1];
    }

    setKeyRoots() {
        this.kr = new Array(this.leafCount + 1).fill(0);
        const visited = new Array(this.nodeCount + 1).fill(false);
        let k = this.kr.length - 1;
        for (let i = this.nodeCount; i >= 1; i--) {
            if (!visited[this.lld(i)]) {
                this.kr[k] = i;
                visited[this.lld(i)] = true;
                k--;
            }
        }
    }
}

export class ZsMatcher {
    private mappings: MappingStore;
    private zsSrc: ZsTree;
    private zsDst: ZsTree;
    private treeDist: number[][];
    private forestDist: number[][];
    private srcTree: BragiAST;
    private dstTree: BragiAST;

    constructor(
        srcTree: BragiAST,
        dstTree: BragiAST,
        mappings: MappingStore,
        srcMetrics: TreeMetricComputer,
        dstMetrics: TreeMetricComputer,
        srcRoot?: AstNode,
        dstRoot?: AstNode,
    ) {
        this.srcTree = srcTree;
        this.dstTree = dstTree;
        this.mappings = mappings;

        const realSrcRoot = srcRoot ?? srcTree.nodes.get(srcTree.rootId)!;
        const realDstRoot = dstRoot ?? dstTree.nodes.get(dstTree.rootId)!;

        this.zsSrc = new ZsTree(srcTree, realSrcRoot, srcMetrics);
        this.zsDst = new ZsTree(dstTree, realDstRoot, dstMetrics);
        this.treeDist = [];
        this.forestDist = [];
    }

    match() {
        this.computeTreeDist();

        let rootNodePair = true;
        const treePairs: [number, number][] = [];
        treePairs.unshift([this.zsSrc.nodeCount, this.zsDst.nodeCount]);

        while (treePairs.length > 0) {
            const [lastRow, lastCol] = treePairs.shift()!;

            if (!rootNodePair) this.forestDistFn(lastRow, lastCol);

            rootNodePair = false;

            const firstRow = this.zsSrc.lld(lastRow) - 1;
            const firstCol = this.zsDst.lld(lastCol) - 1;

            let row = lastRow;
            let col = lastCol;

            while (row > firstRow || col > firstCol) {
                if (row > firstRow && this.forestDist[row - 1][col] + 1 === this.forestDist[row][col]) {
                    row--;
                } else if (col > firstCol && this.forestDist[row][col - 1] + 1 === this.forestDist[row][col]) {
                    col--;
                } else {
                    if (
                        this.zsSrc.lld(row) - 1 === this.zsSrc.lld(lastRow) - 1 &&
                        this.zsDst.lld(col) - 1 === this.zsDst.lld(lastCol) - 1
                    ) {
                        const tSrc = this.zsSrc.tree(row);
                        const tDst = this.zsDst.tree(col);
                        if (tSrc.type === tDst.type) this.mappings.addMapping(tSrc.id, tDst.id);
                        row--;
                        col--;
                    } else {
                        treePairs.unshift([row, col]);
                        row = this.zsSrc.lld(row) - 1;
                        col = this.zsDst.lld(col) - 1;
                    }
                }
            }
        }

        return this.mappings;
    }

    private computeTreeDist() {
        this.treeDist = Array.from({ length: this.zsSrc.nodeCount + 1 }, () =>
            new Array(this.zsDst.nodeCount + 1).fill(0),
        );
        this.forestDist = Array.from({ length: this.zsSrc.nodeCount + 1 }, () =>
            new Array(this.zsDst.nodeCount + 1).fill(0),
        );

        for (let i = 1; i < this.zsSrc.kr.length; i++)
            for (let j = 1; j < this.zsDst.kr.length; j++) this.forestDistFn(this.zsSrc.kr[i], this.zsDst.kr[j]);
    }

    private forestDistFn(i: number, j: number) {
        this.forestDist[this.zsSrc.lld(i) - 1][this.zsDst.lld(j) - 1] = 0;

        for (let di = this.zsSrc.lld(i); di <= i; di++) {
            const costDel = this.getDeletionCost(this.zsSrc.tree(di));
            this.forestDist[di][this.zsDst.lld(j) - 1] = this.forestDist[di - 1][this.zsDst.lld(j) - 1] + costDel;

            for (let dj = this.zsDst.lld(j); dj <= j; dj++) {
                const costIns = this.getInsertionCost(this.zsDst.tree(dj));
                this.forestDist[this.zsSrc.lld(i) - 1][dj] = this.forestDist[this.zsSrc.lld(i) - 1][dj - 1] + costIns;

                if (this.zsSrc.lld(di) === this.zsSrc.lld(i) && this.zsDst.lld(dj) === this.zsDst.lld(j)) {
                    const costUpd = this.getUpdateCost(this.zsSrc.tree(di), this.zsDst.tree(dj));
                    this.forestDist[di][dj] = Math.min(
                        Math.min(this.forestDist[di - 1][dj] + costDel, this.forestDist[di][dj - 1] + costIns),
                        this.forestDist[di - 1][dj - 1] + costUpd,
                    );
                    this.treeDist[di][dj] = this.forestDist[di][dj];
                } else {
                    this.forestDist[di][dj] = Math.min(
                        Math.min(this.forestDist[di - 1][dj] + costDel, this.forestDist[di][dj - 1] + costIns),
                        this.forestDist[this.zsSrc.lld(di) - 1][this.zsDst.lld(dj) - 1] + this.treeDist[di][dj],
                    );
                }
            }
        }
    }

    private getDeletionCost(n: AstNode): number {
        return 1;
    }

    private getInsertionCost(n: AstNode): number {
        return 1;
    }

    private getUpdateCost(n1: AstNode, n2: AstNode): number {
        if (n1.type === n2.type) {
            if (n1.text === "" || n2.text === "") return 1;
            return 1 - this.qGramsDistance(n1.text.toString(), n2.text.toString());
        }
        return Number.MAX_VALUE;
    }

    private qGramsDistance(s1: string, s2: string, q: number = 2): number {
        const getQGrams = (s: string) => {
            const qgrams = new Set<string>();
            for (let i = 0; i <= s.length - q; i++) qgrams.add(s.substring(i, i + q));
            return qgrams;
        };
        const q1 = getQGrams(s1);
        const q2 = getQGrams(s2);
        const intersection = [...q1].filter((g) => q2.has(g)).length;
        return (2 * intersection) / (q1.size + q2.size);
    }
}
