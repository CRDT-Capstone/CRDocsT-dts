import { BragiAST, AstNode, NodeId } from "../../treesitter/types/AST.js";
import { TreeMetricComputer } from "../../treesitter/GumTree/TreeMetricComputer.js";
import { TreeMetrics } from "../../treesitter/GumTree/TreeMetrics.js";

// ---------------------------------------------------------------------------
// Minimal AstNode factory
// ---------------------------------------------------------------------------

export function makeNode(
    id: NodeId,
    type: string,
    text: string,
    childrenIds: NodeId[] = [],
    parentId: NodeId | null = null,
): AstNode {
    return {
        id,
        parentId,
        type,
        text,
        startIndex: 0,
        endIndex: text.length,
        childrenIds,
    } as unknown as AstNode;
}

// ---------------------------------------------------------------------------
// BragiAST factories
// ---------------------------------------------------------------------------

/**
 * Single-node tree (root is a leaf).
 *
 *   root
 */
export function makeSingleNodeTree(rootId = "root", type = "source_file", text = ""): BragiAST {
    const root = makeNode(rootId, type, text, []);
    return { rootId, nodes: new Map([[rootId, root]]) };
}

/**
 * Two-level tree: root → child.
 *
 *   root
 *     └─ child
 */
export function makeParentChildTree(
    rootId = "root",
    childId = "child",
    rootType = "source_file",
    childType = "text",
): BragiAST {
    const child = makeNode(childId, childType, "hello", [], rootId);
    const root = makeNode(rootId, rootType, "hello", [childId]);
    return {
        rootId,
        nodes: new Map([
            [rootId, root],
            [childId, child],
        ]),
    };
}

/**
 * Three-level tree: root → [left, right], each is a leaf.
 *
 *   root
 *     ├─ left
 *     └─ right
 */
export function makeTwoChildTree(
    rootId = "root",
    leftId = "left",
    rightId = "right",
    type = "source_file",
    leftType = "text",
    rightType = "text",
): BragiAST {
    const left = makeNode(leftId, leftType, "a", [], rootId);
    const right = makeNode(rightId, rightType, "b", [], rootId);
    const root = makeNode(rootId, type, "ab", [leftId, rightId]);
    return {
        rootId,
        nodes: new Map([
            [rootId, root],
            [leftId, left],
            [rightId, right],
        ]),
    };
}

/**
 * Identical two-level trees (same structure AND same text) — unique hash match.
 */
export function makeIdenticalTrees(): { srcTree: BragiAST; dstTree: BragiAST } {
    const srcTree = makeParentChildTree("s_root", "s_child", "source_file", "text");
    (srcTree.nodes.get("s_child") as AstNode & { text: string }).text = "hello";
    const dstTree = makeParentChildTree("d_root", "d_child", "source_file", "text");
    (dstTree.nodes.get("d_child") as AstNode & { text: string }).text = "hello";
    return { srcTree, dstTree };
}

/**
 * Build a real TreeMetricComputer for a given tree so that tests can use
 * real hash values rather than mocked ones.
 */
export function buildMetrics(tree: BragiAST): TreeMetricComputer {
    const mc = new TreeMetricComputer();
    mc.buildMetrics(tree, tree.nodes.get(tree.rootId));
    return mc;
}

// ---------------------------------------------------------------------------
// Deeper tree helpers used for synchronize() coverage
// ---------------------------------------------------------------------------

/**
 * Asymmetric pair where srcTree has depth-2 structure and dstTree is a single
 * leaf, forcing the synchronize loop to drain the src PQ children.
 *
 *  src:         dst:
 *   root         dRoot (leaf)
 *     └─ mid
 *          └─ leaf
 */
export function makeAsymmetricTrees(): { srcTree: BragiAST; dstTree: BragiAST } {
    const leaf = makeNode("s_leaf", "text", "x", [], "s_mid");
    const mid = makeNode("s_mid", "source_file", "x", ["s_leaf"], "s_root");
    const sRoot = makeNode("s_root", "source_file", "x", ["s_mid"]);
    const srcTree: BragiAST = {
        rootId: "s_root",
        nodes: new Map([
            ["s_root", sRoot],
            ["s_mid", mid],
            ["s_leaf", leaf],
        ]),
    };

    const dRoot = makeNode("d_root", "source_file", "y", []);
    const dstTree: BragiAST = {
        rootId: "d_root",
        nodes: new Map([["d_root", dRoot]]),
    };

    return { srcTree, dstTree };
}

/**
 * Pair of identical trees that share two children with distinct hashes,
 * producing two unique mappings on the first top-down pass.
 *
 *   root
 *    ├─ childA  ("alpha")
 *    └─ childB  ("beta")
 */
export function makeMultiChildIdenticalTrees(): {
    srcTree: BragiAST;
    dstTree: BragiAST;
} {
    function build(prefix: string): BragiAST {
        const a = makeNode(`${prefix}_a`, "text", "alpha", [], `${prefix}_root`);
        const b = makeNode(`${prefix}_b`, "text", "beta", [], `${prefix}_root`);
        const root = makeNode(`${prefix}_root`, "source_file", "alphabeta", [`${prefix}_a`, `${prefix}_b`]);
        return {
            rootId: `${prefix}_root`,
            nodes: new Map([
                [`${prefix}_root`, root],
                [`${prefix}_a`, a],
                [`${prefix}_b`, b],
            ]),
        };
    }
    return { srcTree: build("s"), dstTree: build("d") };
}

/**
 * Pair where two src nodes share the same hash (same type+text) paired with
 * two dst nodes with the same hash — producing an ambiguous mapping.
 *
 *  src:               dst:
 *   root               root
 *    ├─ n1 ("x")        ├─ n1 ("x")
 *    └─ n2 ("x")        └─ n2 ("x")
 */
export function makeAmbiguousTrees(): { srcTree: BragiAST; dstTree: BragiAST } {
    function build(prefix: string): BragiAST {
        const a = makeNode(`${prefix}_a`, "text", "x", [], `${prefix}_root`);
        const b = makeNode(`${prefix}_b`, "text", "x", [], `${prefix}_root`);
        const root = makeNode(`${prefix}_root`, "source_file", "xx", [`${prefix}_a`, `${prefix}_b`]);
        return {
            rootId: `${prefix}_root`,
            nodes: new Map([
                [`${prefix}_root`, root],
                [`${prefix}_a`, a],
                [`${prefix}_b`, b],
            ]),
        };
    }
    return { srcTree: build("s"), dstTree: build("d") };
}

// ---------------------------------------------------------------------------
// TreeMetrics helpers
// ---------------------------------------------------------------------------

export function makeMetrics(
    size: number,
    height: number,
    hash: number,
    structureHash = 0,
    depth = 0,
    position = 0,
): TreeMetrics {
    return new TreeMetrics(size, height, hash, structureHash, depth, position);
}
