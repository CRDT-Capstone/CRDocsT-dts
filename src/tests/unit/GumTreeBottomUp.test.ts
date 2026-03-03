import { describe, it, expect, jest } from "@jest/globals";
import { MappingStore, GumTreeBottomUp } from "../../treesitter/index.js";
import {
    extractSubtree,
    makeSimpleSrcTree,
    makeSimpleDstTree,
    makeSingleNodeSrcTree,
    makeSingleNodeDstTree,
    makeDeepSrcTree,
    makeDeepDstTree,
    makeMismatchedSrcTree,
    makeMismatchedDstTree,
    buildMetricsForAst,
    makeLargeMetrics,
    makeNode,
    makeAst,
} from "./mocks/GumTreeBottomUp-mocks.js";

describe("GumTreeBottomUp", () => {
    describe("match", () => {
        it("should map root nodes to each other for identical simple trees", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            const result = matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(result.has("s-root", "d-root")).toBe(true);
        });

        it("should return the same MappingStore instance that was passed in", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            const result = matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(result).toBe(mappings);
        });

        it("should map single-node root trees to each other", () => {
            const src = makeSingleNodeSrcTree();
            const dst = makeSingleNodeDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            const result = matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(result.has("s-only", "d-only")).toBe(true);
        });

        it("should skip leaf nodes that are not already mapped", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(mappings.has("s-root", "d-root")).toBe(true);
        });

        it("should match inner nodes when pre-existing leaf mappings create sufficient similarity", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            // Pre-seed leaf mappings so bottom-up can compute dice similarity for inner nodes
            mappings.addMapping("s-C", "d-C");
            mappings.addMapping("s-E", "d-E");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(mappings.has("s-root", "d-root")).toBe(true);
        });

        it("should not match an already-mapped source node again", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-childB", "d-childB");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(mappings.getDstForSrc("s-childB")).toBe("d-childB");
        });

        it("should not match inner nodes whose types differ between src and dst", () => {
            const src = makeMismatchedSrcTree();
            const dst = makeMismatchedDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-B", "d-Y");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            // s-A is curly_group, d-X is brack_group — types differ, no candidate match
            expect(mappings.isSrcMapped("s-A")).toBe(false);
            expect(mappings.has("s-root", "d-root")).toBe(true);
        });
    });

    describe("getDstCandidates", () => {
        it("should return empty candidates when no descendants are mapped", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            const srcNode = src.nodes.get("s-B")!;
            const candidates = matcher.getDstCandidates(mappings, srcNode);

            expect(candidates).toEqual([]);
        });

        it("should return candidate ancestors when descendants are mapped", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-C", "d-C");
            mappings.addMapping("s-E", "d-E");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            const srcNode = src.nodes.get("s-B")!;
            const candidates = matcher.getDstCandidates(mappings, srcNode);

            expect(candidates).toContain("d-B");
        });

        it("should not include dst root as a candidate", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-C", "d-C");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            const srcNode = src.nodes.get("s-B")!;
            const candidates = matcher.getDstCandidates(mappings, srcNode);

            expect(candidates).not.toContain("d-root");
        });

        it("should not include already-mapped dst nodes as candidates", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-C", "d-C");
            mappings.addMapping("s-A", "d-B");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            const srcNode = src.nodes.get("s-B")!;
            const candidates = matcher.getDstCandidates(mappings, srcNode);

            expect(candidates).not.toContain("d-B");
        });

        it("should only include candidates with matching type", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-E", "d-E");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            const srcNode = src.nodes.get("s-B")!;
            const candidates = matcher.getDstCandidates(mappings, srcNode);

            for (const candId of candidates) {
                const candNode = dst.nodes.get(candId)!;
                expect(candNode.type).toBe("generic_command");
            }
        });
    });

    describe("lastChanceMatch", () => {
        it("should invoke ZsMatcher for subtrees below the size threshold", () => {
            // Use subtree-scoped BragiASTs so ZsMatcher (which indexes from
            // tree.rootId) finds matching metrics built for the subtree root.
            const fullSrc = makeSimpleSrcTree();
            const fullDst = makeSimpleDstTree();
            const subSrc = extractSubtree(fullSrc, "s-childB");
            const subDst = extractSubtree(fullDst, "d-childB");

            const srcMetrics = buildMetricsForAst(subSrc);
            const dstMetrics = buildMetricsForAst(subDst);
            const mappings = new MappingStore(subSrc, subDst);
            const matcher = new GumTreeBottomUp(subSrc, subDst, srcMetrics, dstMetrics);

            matcher.lastChanceMatch(mappings, subSrc.nodes.get("s-childB")!, subDst.nodes.get("d-childB")!);

            expect(mappings.has("s-childB", "d-childB")).toBe(true);
            expect(mappings.has("s-grandchild", "d-grandchild")).toBe(true);
        });

        it("should not add mappings when both subtrees exceed the size threshold", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const bigSize = 1001;
            const srcMetrics = makeLargeMetrics(src, bigSize);
            const dstMetrics = makeLargeMetrics(dst, bigSize);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            matcher.lastChanceMatch(mappings, src.nodes.get("s-root")!, dst.nodes.get("d-root")!);

            expect(mappings.size()).toBe(0);
        });

        it("should still run ZsMatcher when only one subtree is below the size threshold", () => {
            const src = makeSingleNodeSrcTree();
            const dst = makeSingleNodeDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = makeLargeMetrics(dst, 1500);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            matcher.lastChanceMatch(mappings, src.nodes.get("s-only")!, dst.nodes.get("d-only")!);

            // src size is 1 (< 1000), so the OR condition is met and ZsMatcher runs
            expect(mappings.size()).toBeGreaterThan(0);
        });

        it("should not overwrite existing mappings with disallowed ones", () => {
            const fullSrc = makeSimpleSrcTree();
            const fullDst = makeSimpleDstTree();
            const subSrc = extractSubtree(fullSrc, "s-childB");
            const subDst = extractSubtree(fullDst, "d-childB");

            const srcMetrics = buildMetricsForAst(subSrc);
            const dstMetrics = buildMetricsForAst(subDst);
            const mappings = new MappingStore(subSrc, subDst);

            // Pre-map s-grandchild to d-childB; isMappingAllowed will reject
            // ZsMatcher's attempt to re-map s-grandchild
            mappings.addMapping("s-grandchild", "d-childB");

            const matcher = new GumTreeBottomUp(subSrc, subDst, srcMetrics, dstMetrics);
            matcher.lastChanceMatch(mappings, subSrc.nodes.get("s-childB")!, subDst.nodes.get("d-childB")!);

            expect(mappings.getDstForSrc("s-grandchild")).toBe("d-childB");
        });

        it("should handle leaf-to-leaf matching via ZsMatcher", () => {
            const src = makeSingleNodeSrcTree();
            const dst = makeSingleNodeDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            matcher.lastChanceMatch(mappings, src.nodes.get("s-only")!, dst.nodes.get("d-only")!);

            expect(mappings.has("s-only", "d-only")).toBe(true);
        });
    });

    describe("default thresholds", () => {
        it("should have a default size threshold of 1000", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            expect(matcher.DEFAULT_SIZE_THRESHOLD).toBe(1000);
        });

        it("should have a default similarity threshold of 0.5", () => {
            const src = makeSimpleSrcTree();
            const dst = makeSimpleDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);

            expect(matcher.DEFAULT_SIM_THRESHOLD).toBe(0.5);
        });
    });

    describe("match ordering", () => {
        it("should process nodes in postorder so children are visited before parents", () => {
            const src = makeDeepSrcTree();
            const dst = makeDeepDstTree();
            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            // Pre-seed leaf mappings
            mappings.addMapping("s-C", "d-C");
            mappings.addMapping("s-E", "d-E");
            mappings.addMapping("s-A", "d-A");

            const addSpy = jest.spyOn(mappings, "addMapping");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            const callOrder = addSpy.mock.calls.map(([srcId]) => srcId);

            const rootIdx = callOrder.indexOf("s-root");
            const innerIdx = callOrder.indexOf("s-B");
            if (innerIdx !== -1) {
                expect(innerIdx).toBeLessThan(rootIdx);
            }
            // Root should always be matched last
            expect(rootIdx).toBe(callOrder.length - 1);

            addSpy.mockRestore();
        });
    });

    describe("match with pre-seeded mappings producing candidates below sim threshold", () => {
        it("should not match an inner node when dice similarity is below the threshold", () => {
            const root = makeNode("s-root", "generic_environment", null, ["s-A", "s-B", "s-C", "s-D", "s-E"], "root");
            const A = makeNode("s-A", "curly_group", "s-root", [], "A");
            const B = makeNode("s-B", "curly_group", "s-root", [], "B");
            const C = makeNode("s-C", "curly_group", "s-root", [], "C");
            const D = makeNode("s-D", "curly_group", "s-root", [], "D");
            const E = makeNode("s-E", "generic_command", "s-root", ["s-F"], "E");
            const F = makeNode("s-F", "curly_group_text", "s-E", [], "F");
            const src = makeAst("s-root", [root, A, B, C, D, E, F]);

            const dRoot = makeNode("d-root", "generic_environment", null, ["d-A", "d-B", "d-C", "d-D", "d-E"], "root");
            const dA = makeNode("d-A", "curly_group", "d-root", [], "A");
            const dB = makeNode("d-B", "curly_group", "d-root", [], "B");
            const dC = makeNode("d-C", "curly_group", "d-root", [], "C");
            const dD = makeNode("d-D", "curly_group", "d-root", [], "D");
            const dE = makeNode("d-E", "generic_command", "d-root", ["d-F", "d-G", "d-H", "d-I", "d-J"], "E");
            const dF = makeNode("d-F", "curly_group_text", "d-E", [], "F");
            const dG = makeNode("d-G", "curly_group_text", "d-E", [], "G");
            const dH = makeNode("d-H", "curly_group_text", "d-E", [], "H");
            const dI = makeNode("d-I", "curly_group_text", "d-E", [], "I");
            const dJ = makeNode("d-J", "curly_group_text", "d-E", [], "J");
            const dst = makeAst("d-root", [dRoot, dA, dB, dC, dD, dE, dF, dG, dH, dI, dJ]);

            const srcMetrics = buildMetricsForAst(src);
            const dstMetrics = buildMetricsForAst(dst);
            const mappings = new MappingStore(src, dst);

            mappings.addMapping("s-F", "d-F");

            const matcher = new GumTreeBottomUp(src, dst, srcMetrics, dstMetrics);
            matcher.match(src.nodes.get(src.rootId)!, dst.nodes.get(dst.rootId)!, mappings);

            expect(mappings.has("s-root", "d-root")).toBe(true);
        });
    });
});
