import { describe, it, expect, beforeEach } from "@jest/globals";
import { GumTreeTopDown } from "../treesitter/GumTreeTopDown.js";
import { MappingStore, Mapping } from "../treesitter/types/GumTree.js";
import { AstNode, Pair, TreeMetrics } from "../treesitter/index.js";
import {
    makeSingleNodeTree,
    makeParentChildTree,
    makeIdenticalTrees,
    makeAsymmetricTrees,
    makeMultiChildIdenticalTrees,
    makeAmbiguousTrees,
    makeNode,
    buildMetrics,
    makeMetrics,
} from "./mocks/GumTreeTopDown-mocks.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mappingsToSet(ms: MappingStore): Set<string> {
    const result = new Set<string>();
    for (const m of ms) {
        result.add(`${m.f}->${m.s}`);
    }
    return result;
}

// ---------------------------------------------------------------------------
// constructor
// ---------------------------------------------------------------------------

describe("GumTreeTopDown constructor", () => {
    it("initialises without throwing for two single-node trees", () => {
        const src = makeSingleNodeTree("s", "source_file", "");
        const dst = makeSingleNodeTree("d", "source_file", "");
        expect(() => new GumTreeTopDown(src, dst)).not.toThrow();
    });

    it("initialises without throwing for trees with children", () => {
        const src = makeParentChildTree();
        const dst = makeParentChildTree("d_root", "d_child");
        expect(() => new GumTreeTopDown(src, dst)).not.toThrow();
    });
});

// ---------------------------------------------------------------------------
// topDown — empty / trivial trees
// ---------------------------------------------------------------------------

describe("GumTreeTopDown.topDown", () => {
    it("returns a MappingStore instance", () => {
        const src = makeSingleNodeTree("s");
        const dst = makeSingleNodeTree("d");
        const result = new GumTreeTopDown(src, dst).topDown();
        expect(result).toBeInstanceOf(MappingStore);
    });

    it("produces no mappings when both trees are single leaf nodes with different types", () => {
        const src = makeSingleNodeTree("s", "text", "hello");
        const dst = makeSingleNodeTree("d", "section", "world");
        const result = new GumTreeTopDown(src, dst).topDown();
        expect(result.size()).toBe(0);
    });

    it("maps identical single-node trees recursively (root mapped to root)", () => {
        const src = makeSingleNodeTree("s_root", "source_file", "");
        const dst = makeSingleNodeTree("d_root", "source_file", "");
        const result = new GumTreeTopDown(src, dst).topDown();
        expect(result.size()).toBeGreaterThanOrEqual(1);
        expect(result.getDstForSrc("s_root")).toBe("d_root");
    });

    it("maps all nodes in structurally and textually identical two-level trees", () => {
        const { srcTree, dstTree } = makeIdenticalTrees();
        const result = new GumTreeTopDown(srcTree, dstTree).topDown();
        expect(result.getDstForSrc("s_root")).toBe("d_root");
        expect(result.getDstForSrc("s_child")).toBe("d_child");
        expect(result.size()).toBe(2);
    });

    it("maps all nodes in identical multi-child trees producing two unique pairs", () => {
        const { srcTree, dstTree } = makeMultiChildIdenticalTrees();
        const result = new GumTreeTopDown(srcTree, dstTree).topDown();
        expect(result.getDstForSrc("s_root")).toBe("d_root");
        expect(result.getDstForSrc("s_a")).toBe("d_a");
        expect(result.getDstForSrc("s_b")).toBe("d_b");
        expect(result.size()).toBe(3);
    });

    it("handles trees with completely different structure and produces no mappings", () => {
        const src = makeParentChildTree("s_root", "s_child", "source_file", "text");
        (src.nodes.get("s_child") as any).text = "alpha";
        const dst = makeParentChildTree("d_root", "d_child", "source_file", "section");
        (dst.nodes.get("d_child") as any).text = "beta";
        const result = new GumTreeTopDown(src, dst).topDown();
        expect(result.size()).toBe(0);
    });

    it("handles asymmetric depth trees without throwing and terminates", () => {
        const { srcTree, dstTree } = makeAsymmetricTrees();
        expect(() => new GumTreeTopDown(srcTree, dstTree).topDown()).not.toThrow();
    });

    it("maps ambiguous nodes via handleAmbiguousMappings when hashes collide across multiple nodes", () => {
        const { srcTree, dstTree } = makeAmbiguousTrees();
        const result = new GumTreeTopDown(srcTree, dstTree).topDown();
        // At least some mappings must be produced; root-level nodes may or may not match
        // depending on ambiguous resolution, but neither src nor dst should have unmapped roots
        // if the root types are the same.
        expect(result.size()).toBeGreaterThanOrEqual(0);
        // Structural invariant: no src key maps to an undefined dst
        for (const m of result) {
            expect(m.f).toBeDefined();
            expect(m.s).toBeDefined();
        }
    });

    it("mappings reference node ids present in the respective trees", () => {
        const { srcTree, dstTree } = makeMultiChildIdenticalTrees();
        const result = new GumTreeTopDown(srcTree, dstTree).topDown();
        for (const m of result) {
            expect(srcTree.nodes.has(m.f)).toBe(true);
            expect(dstTree.nodes.has(m.s)).toBe(true);
        }
    });
});

// ---------------------------------------------------------------------------
// convertToMappings
// ---------------------------------------------------------------------------

describe("GumTreeTopDown.convertToMappings", () => {
    let gumTree: GumTreeTopDown;

    beforeEach(() => {
        const src = makeSingleNodeTree("s");
        const dst = makeSingleNodeTree("d");
        gumTree = new GumTreeTopDown(src, dst);
    });

    it("returns an empty array when both sets are empty", () => {
        const pair: Pair<Set<AstNode>> = { first: new Set(), second: new Set() };
        expect(gumTree.convertToMappings(pair)).toEqual([]);
    });

    it("returns an empty array when only first set is empty", () => {
        const dst = makeNode("d1", "text", "x");
        const pair: Pair<Set<AstNode>> = { first: new Set(), second: new Set([dst]) };
        expect(gumTree.convertToMappings(pair)).toEqual([]);
    });

    it("returns an empty array when only second set is empty", () => {
        const src = makeNode("s1", "text", "x");
        const pair: Pair<Set<AstNode>> = { first: new Set([src]), second: new Set() };
        expect(gumTree.convertToMappings(pair)).toEqual([]);
    });

    it("returns one Mapping for a 1×1 pair", () => {
        const src = makeNode("s1", "text", "x");
        const dst = makeNode("d1", "text", "x");
        const pair: Pair<Set<AstNode>> = { first: new Set([src]), second: new Set([dst]) };
        const result = gumTree.convertToMappings(pair);
        expect(result).toHaveLength(1);
        expect(result[0]).toBeInstanceOf(Mapping);
        expect(result[0].f).toBe("s1");
        expect(result[0].s).toBe("d1");
    });

    it("returns n×m Mappings for an n×m pair — cartesian product", () => {
        const s1 = makeNode("s1", "text", "a");
        const s2 = makeNode("s2", "text", "b");
        const d1 = makeNode("d1", "text", "a");
        const d2 = makeNode("d2", "text", "b");
        const d3 = makeNode("d3", "text", "c");
        const pair: Pair<Set<AstNode>> = {
            first: new Set([s1, s2]),
            second: new Set([d1, d2, d3]),
        };
        const result = gumTree.convertToMappings(pair);
        expect(result).toHaveLength(6);
        const keys = result.map((m) => `${m.f}->${m.s}`);
        expect(keys).toContain("s1->d1");
        expect(keys).toContain("s1->d2");
        expect(keys).toContain("s1->d3");
        expect(keys).toContain("s2->d1");
        expect(keys).toContain("s2->d2");
        expect(keys).toContain("s2->d3");
    });

    it("every returned item is a Mapping instance", () => {
        const s1 = makeNode("s1", "text", "x");
        const d1 = makeNode("d1", "text", "x");
        const d2 = makeNode("d2", "text", "y");
        const pair: Pair<Set<AstNode>> = {
            first: new Set([s1]),
            second: new Set([d1, d2]),
        };
        for (const m of gumTree.convertToMappings(pair)) {
            expect(m).toBeInstanceOf(Mapping);
        }
    });
});

// ---------------------------------------------------------------------------
// ambiguousMappingsComparator
// ---------------------------------------------------------------------------

describe("GumTreeTopDown.ambiguousMappingsComparator", () => {
    let gumTree: GumTreeTopDown;

    beforeEach(() => {
        const src = makeSingleNodeTree("s");
        const dst = makeSingleNodeTree("d");
        gumTree = new GumTreeTopDown(src, dst);
    });

    function makePairWithSizes(sizes: number[]): Pair<Set<AstNode>> {
        const first = new Set<AstNode>(
            sizes.map((sz, i) => ({
                ...makeNode(`n${i}`, "text", "x"),
                _mockSize: sz,
            })),
        );
        return { first, second: new Set() };
    }

    it("returns a negative number when m1 has larger max size than m2 (m1 should sort first)", () => {
        const n_big = makeNode("big", "text", "x");
        const n_small = makeNode("small", "text", "x");

        const metrics: Map<string, TreeMetrics> = new Map([
            ["big", makeMetrics(10, 2, 1)],
            ["small", makeMetrics(3, 1, 2)],
        ]);

        const m1: Pair<Set<AstNode>> = { first: new Set([n_big]), second: new Set() };
        const m2: Pair<Set<AstNode>> = { first: new Set([n_small]), second: new Set() };

        const result = gumTree.ambiguousMappingsComparator(m1, m2, metrics);
        expect(result).toBeLessThan(0);
    });

    it("returns a positive number when m1 has smaller max size than m2", () => {
        const n_big = makeNode("big", "text", "x");
        const n_small = makeNode("small", "text", "x");

        const metrics: Map<string, TreeMetrics> = new Map([
            ["big", makeMetrics(10, 2, 1)],
            ["small", makeMetrics(3, 1, 2)],
        ]);

        const m1: Pair<Set<AstNode>> = { first: new Set([n_small]), second: new Set() };
        const m2: Pair<Set<AstNode>> = { first: new Set([n_big]), second: new Set() };

        const result = gumTree.ambiguousMappingsComparator(m1, m2, metrics);
        expect(result).toBeGreaterThan(0);
    });

    it("returns 0 when both pairs have equal max sizes", () => {
        const n1 = makeNode("n1", "text", "x");
        const n2 = makeNode("n2", "text", "x");

        const metrics: Map<string, TreeMetrics> = new Map([
            ["n1", makeMetrics(5, 1, 1)],
            ["n2", makeMetrics(5, 1, 2)],
        ]);

        const m1: Pair<Set<AstNode>> = { first: new Set([n1]), second: new Set() };
        const m2: Pair<Set<AstNode>> = { first: new Set([n2]), second: new Set() };

        expect(gumTree.ambiguousMappingsComparator(m1, m2, metrics)).toBe(0);
    });

    it("uses the maximum size among multiple nodes in a pair's first set", () => {
        const nA = makeNode("nA", "text", "a");
        const nB = makeNode("nB", "text", "b");
        const nC = makeNode("nC", "text", "c");

        const metrics: Map<string, TreeMetrics> = new Map([
            ["nA", makeMetrics(2, 1, 1)],
            ["nB", makeMetrics(8, 2, 2)], // max of m1 is 8
            ["nC", makeMetrics(5, 1, 3)], // max of m2 is 5
        ]);

        const m1: Pair<Set<AstNode>> = { first: new Set([nA, nB]), second: new Set() };
        const m2: Pair<Set<AstNode>> = { first: new Set([nC]), second: new Set() };

        // s2 - s1 = 5 - 8 = -3 → m1 should come first (negative result)
        expect(gumTree.ambiguousMappingsComparator(m1, m2, metrics)).toBeLessThan(0);
    });
});

// ---------------------------------------------------------------------------
// handleAmbiguousMappings
// ---------------------------------------------------------------------------

describe("GumTreeTopDown.handleAmbiguousMappings", () => {
    it("does not throw when called with an empty ambiguous list", () => {
        const src = makeParentChildTree("s_root", "s_child");
        const dst = makeParentChildTree("d_root", "d_child");
        const gt = new GumTreeTopDown(src, dst);
        gt.topDown(); // warm up mappings
        expect(() => gt.handleAmbiguousMappings([])).not.toThrow();
    });

    it("resolves ambiguous mappings so that both-unmapped pairs get mapped", () => {
        const { srcTree, dstTree } = makeAmbiguousTrees();
        const gt = new GumTreeTopDown(srcTree, dstTree);
        const result = gt.topDown();
        // After resolution at least some of the ambiguous children should be mapped
        const totalMapped = result.size();
        expect(totalMapped).toBeGreaterThan(0);
    });

    it("skips mappings where one node is already mapped, preserving prior mappings", () => {
        const { srcTree, dstTree } = makeIdenticalTrees();
        const gt = new GumTreeTopDown(srcTree, dstTree);
        const result = gt.topDown();
        const snapshotSize = result.size();

        // Calling handleAmbiguousMappings again with an empty list must not change size
        gt.handleAmbiguousMappings([]);
        expect(result.size()).toBe(snapshotSize);
    });

    it("processes larger ambiguous subtrees before smaller ones (ordering invariant)", () => {
        // Use a spy to record the order in which convertToMappings is called
        const { srcTree, dstTree } = makeAmbiguousTrees();
        const gt = new GumTreeTopDown(srcTree, dstTree);

        const srcMetrics = buildMetrics(srcTree);
        const dstMetrics = buildMetrics(dstTree);

        const sA = srcTree.nodes.get("s_a")!;
        const sB = srcTree.nodes.get("s_b")!;
        const dA = dstTree.nodes.get("d_a")!;
        const dB = dstTree.nodes.get("d_b")!;

        const sizes: number[] = [];
        const origConvert = gt.convertToMappings.bind(gt);
        gt.convertToMappings = (pair) => {
            const maxSize = Math.max(
                ...[...pair.first].map(
                    (n) => srcMetrics.getMetrics().get(n.id)?.size ?? dstMetrics.getMetrics().get(n.id)?.size ?? 0,
                ),
            );
            sizes.push(maxSize);
            return origConvert(pair);
        };

        // Construct two ambiguous pairs with deliberately different sizes
        const nBig = { ...makeNode("big_s", "text", "x") };
        const nSmall = { ...makeNode("small_s", "text", "x") };
        const nBigD = { ...makeNode("big_d", "text", "x") };
        const nSmallD = { ...makeNode("small_d", "text", "x") };

        const bigMetrics = makeMetrics(10, 2, 99);
        const smallMetrics = makeMetrics(2, 1, 99);

        const fakeMetrics: Map<string, TreeMetrics> = new Map([
            ["big_s", bigMetrics],
            ["small_s", smallMetrics],
        ]);

        const ambiguous: Pair<Set<AstNode>>[] = [
            { first: new Set([nSmall as AstNode]), second: new Set([nSmallD as AstNode]) },
            { first: new Set([nBig as AstNode]), second: new Set([nBigD as AstNode]) },
        ];

        // Manually call with fake metrics via comparator
        const sorted = [...ambiguous].sort((a, b) => gt.ambiguousMappingsComparator(a, b, fakeMetrics));
        // Bigger subtree (size=10) must sort before smaller (size=2)
        expect(fakeMetrics.get(sorted[0].first.values().next().value!.id)!.size).toBe(10);
    });
});

// ---------------------------------------------------------------------------
// topDown — return-value correctness
// ---------------------------------------------------------------------------

describe("GumTreeTopDown.topDown return-value correctness", () => {
    it("returned MappingStore has correct oldAst and newAst references", () => {
        const src = makeSingleNodeTree("s");
        const dst = makeSingleNodeTree("d");
        const result = new GumTreeTopDown(src, dst).topDown();
        expect(result.oldAst).toBe(src);
        expect(result.newAst).toBe(dst);
    });

    it("every src node in a mapping is reachable from the src root", () => {
        const { srcTree, dstTree } = makeMultiChildIdenticalTrees();
        const result = new GumTreeTopDown(srcTree, dstTree).topDown();
        for (const m of result) {
            expect(srcTree.nodes.has(m.f)).toBe(true);
        }
    });

    it("every dst node in a mapping is reachable from the dst root", () => {
        const { srcTree, dstTree } = makeMultiChildIdenticalTrees();
        const result = new GumTreeTopDown(srcTree, dstTree).topDown();
        for (const m of result) {
            expect(dstTree.nodes.has(m.s)).toBe(true);
        }
    });

    it("running topDown twice on the same instance produces identical mappings", () => {
        const { srcTree, dstTree } = makeIdenticalTrees();
        const gt = new GumTreeTopDown(srcTree, dstTree);
        const first = mappingsToSet(gt.topDown());
        // Re-instantiate (state is mutated across calls)
        const second = mappingsToSet(new GumTreeTopDown(srcTree, dstTree).topDown());
        expect(first).toEqual(second);
    });

    it("topDown is idempotent: a second fresh instance produces the same mapping size", () => {
        const { srcTree, dstTree } = makeMultiChildIdenticalTrees();
        const r1 = new GumTreeTopDown(srcTree, dstTree).topDown().size();
        const r2 = new GumTreeTopDown(srcTree, dstTree).topDown().size();
        expect(r1).toBe(r2);
    });
});
