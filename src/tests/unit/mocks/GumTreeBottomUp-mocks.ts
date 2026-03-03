import { TreeMetricComputer, TreeMetrics, AstNode, BragiAST, NodeId } from "../../../treesitter/index.js";

export function makeNode(
    id: NodeId,
    type: string,
    parentId: NodeId | null,
    childrenIds: NodeId[] = [],
    text: string = "",
): AstNode {
    return {
        id,
        parentId,
        type,
        text,
        startIndex: 0,
        endIndex: 0,
        childrenIds,
    } as unknown as AstNode;
}

export function makeAst(rootId: NodeId, nodes: AstNode[]): BragiAST {
    const map = new Map<NodeId, AstNode>();
    for (const n of nodes) map.set(n.id, n);
    return { rootId, nodes: map };
}

export function buildMetricsForAst(ast: BragiAST): TreeMetricComputer {
    const comp = new TreeMetricComputer();
    comp.buildMetrics(ast, ast.nodes.get(ast.rootId));
    return comp;
}

/**
 * Extracts a sub-BragiAST rooted at `subRootId`, collecting all descendants.
 * The resulting BragiAST has `rootId` set to `subRootId` so that ZsMatcher
 * (which always looks up `tree.rootId`) finds the correct metrics entry.
 */
export function extractSubtree(fullAst: BragiAST, subRootId: NodeId): BragiAST {
    const nodes = new Map<NodeId, AstNode>();
    const stack = [subRootId];
    while (stack.length > 0) {
        const id = stack.pop()!;
        const node = fullAst.nodes.get(id)!;
        nodes.set(id, node);
        for (const childId of node.childrenIds) {
            stack.push(childId);
        }
    }
    return { rootId: subRootId, nodes };
}

/**
 * Builds a simple tree:
 *       root (generic_environment)
 *      /    \
 *   childA   childB (generic_command)
 *   (leaf)     |
 *            grandchild (leaf)
 */
export function makeSimpleSrcTree() {
    const root = makeNode("s-root", "generic_environment", null, ["s-childA", "s-childB"], "root");
    const childA = makeNode("s-childA", "curly_group", "s-root", [], "childA");
    const childB = makeNode("s-childB", "generic_command", "s-root", ["s-grandchild"], "childB");
    const grandchild = makeNode("s-grandchild", "curly_group_text", "s-childB", [], "grandchild");
    return makeAst("s-root", [root, childA, childB, grandchild]);
}

export function makeSimpleDstTree() {
    const root = makeNode("d-root", "generic_environment", null, ["d-childA", "d-childB"], "root");
    const childA = makeNode("d-childA", "curly_group", "d-root", [], "childA");
    const childB = makeNode("d-childB", "generic_command", "d-root", ["d-grandchild"], "childB");
    const grandchild = makeNode("d-grandchild", "curly_group_text", "d-childB", [], "grandchild");
    return makeAst("d-root", [root, childA, childB, grandchild]);
}

/**
 * A single root with no children (leaf-only tree).
 */
export function makeSingleNodeSrcTree() {
    const root = makeNode("s-only", "curly_group", null, [], "only");
    return makeAst("s-only", [root]);
}

export function makeSingleNodeDstTree() {
    const root = makeNode("d-only", "curly_group", null, [], "only");
    return makeAst("d-only", [root]);
}

/**
 * Builds a deeper tree to test candidate traversal:
 *        root (generic_environment)
 *       /    \
 *    A         B (generic_command)
 *  (leaf)     / \
 *           C     D (brack_group)
 *         (leaf)    |
 *                   E (leaf)
 */
export function makeDeepSrcTree() {
    const root = makeNode("s-root", "generic_environment", null, ["s-A", "s-B"], "root");
    const A = makeNode("s-A", "curly_group", "s-root", [], "A");
    const B = makeNode("s-B", "generic_command", "s-root", ["s-C", "s-D"], "B");
    const C = makeNode("s-C", "curly_group_text", "s-B", [], "C");
    const D = makeNode("s-D", "brack_group", "s-B", ["s-E"], "D");
    const E = makeNode("s-E", "curly_group", "s-D", [], "E");
    return makeAst("s-root", [root, A, B, C, D, E]);
}

export function makeDeepDstTree() {
    const root = makeNode("d-root", "generic_environment", null, ["d-A", "d-B"], "root");
    const A = makeNode("d-A", "curly_group", "d-root", [], "A");
    const B = makeNode("d-B", "generic_command", "d-root", ["d-C", "d-D"], "B");
    const C = makeNode("d-C", "curly_group_text", "d-B", [], "C");
    const D = makeNode("d-D", "brack_group", "d-B", ["d-E"], "D");
    const E = makeNode("d-E", "curly_group", "d-D", [], "E");
    return makeAst("d-root", [root, A, B, C, D, E]);
}

/**
 * Trees where src and dst differ in structure to test mismatch paths.
 */
export function makeMismatchedSrcTree() {
    const root = makeNode("s-root", "generic_environment", null, ["s-A"], "root");
    const A = makeNode("s-A", "curly_group", "s-root", ["s-B"], "A");
    const B = makeNode("s-B", "curly_group_text", "s-A", [], "B");
    return makeAst("s-root", [root, A, B]);
}

export function makeMismatchedDstTree() {
    const root = makeNode("d-root", "generic_environment", null, ["d-X"], "root");
    const X = makeNode("d-X", "brack_group", "d-root", ["d-Y"], "X");
    const Y = makeNode("d-Y", "curly_group_text", "d-X", [], "Y");
    return makeAst("d-root", [root, X, Y]);
}

/**
 * Overrides the root metric's size to simulate a large tree that exceeds
 * the DEFAULT_SIZE_THRESHOLD, preventing lastChanceMatch from running ZsMatcher.
 */
export function makeLargeMetrics(ast: BragiAST, sizeOverride: number): TreeMetricComputer {
    const comp = new TreeMetricComputer();
    comp.buildMetrics(ast, ast.nodes.get(ast.rootId));
    const metrics = comp.getMetrics();
    const rootMetrics = metrics.get(ast.rootId)!;
    metrics.set(
        ast.rootId,
        new TreeMetrics(
            sizeOverride,
            rootMetrics.height,
            rootMetrics.hash,
            rootMetrics.structureHash,
            rootMetrics.depth,
            rootMetrics.position,
        ),
    );
    return comp;
}
