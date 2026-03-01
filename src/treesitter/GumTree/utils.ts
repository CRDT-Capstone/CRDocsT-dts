import { AstNode, BragiAST, NodeId } from "../types/AST.js";

export function diceCoefficient(commonElementsNb: number, leftElementsNb: number, rightElementsNb: number): number {
    return (2 * commonElementsNb) / (leftElementsNb + rightElementsNb);
}

export function longestCommonSubsequenceWithType(s0: AstNode[], s1: AstNode[]) {
    const lengths: number[][] = Array.from({ length: s0.length + 1 }, () => new Array(s1.length + 1).fill(0));

    for (let i = 0; i < s0.length; ++i) {
        for (let j = 0; j < s1.length; ++j) {
            if (s0[i].type === s1[i].type) {
                lengths[i + 1][j + 1] = lengths[i][j] + 1;
            } else {
                lengths[i + 1][j + 1] = Math.max(lengths[i + 1][j], lengths[i][j + 1]);
            }
        }
    }

    return extractIndexes(lengths, s0.length, s1.length);
}

function extractIndexes(lengths: number[][], length1: number, length2: number) {
    const indexes: [number, number][] = [];
    for (let x = length1, y = length2; x !== 0 && y !== 0; ) {
        if (lengths[x][y] === lengths[x - 1][y]) x--;
        else if (lengths[x][y] === lengths[x][y - 1]) y--;
        else {
            indexes.push([x - 1, y - 1]);
            x--;
            y--;
        }
    }
    indexes.reverse();
    return indexes;
}

export function getParent(nodeId: NodeId, tree: BragiAST) {
    const node = tree.nodes.get(nodeId)!;
    return node.parentId === null ? undefined : tree.nodes.get(node.parentId)!;
}

export function getParents(tree: BragiAST, parents: AstNode[], nodeId: NodeId | null): AstNode[] {
    if (!nodeId) return parents;
    const node = tree.nodes.get(nodeId)!;
    if (node.parentId === null) return parents;
    const parent = tree.nodes.get(node.parentId)!;
    parents.push(parent);
    return getParents(tree, parents, node.parentId);
}

