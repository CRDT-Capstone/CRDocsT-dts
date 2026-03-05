import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { Parser } from "web-tree-sitter";
import { getParser } from "../unit/mocks/BragiAST-mocks.js";
import { parseCST, BragiAST } from "../../treesitter/types/AST.js";
import { GumTreeTopDown } from "../../treesitter/GumTreeTopDown.js";
import { GumTreeBottomUp } from "../../treesitter/GumTreeBottomUp.js";
import { TreeMetricComputer } from "../../treesitter/GumTree/TreeMetricComputer.js";
import { LATEX_DOC_FIXTURES } from "./mocks/AST_GumTree-mocks.js";
import { MappingStore } from "../../treesitter/types/GumTree.js";
import { getSafeAst } from "../utils.js";

describe("GumTree Differencing Integration", () => {
    const getAst = async (sourceCode: string): Promise<BragiAST> => {
        const ast = await getSafeAst(sourceCode);

        return ast;
    };

    /**
     * Sub-flow: AST -> GumTreeTopDown
     */
    describe("AST -> GumTreeTopDown Integration", () => {
        it("produces an initial MappingStore identifying identical subtrees", async () => {
            const baseAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_BASE);
            const appendedAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_APPENDED);

            const topDown = new GumTreeTopDown(baseAst, appendedAst);
            const mappings = topDown.topDown();

            expect(mappings).toBeInstanceOf(MappingStore);
            expect(mappings.size()).toBeGreaterThan(0);
        });

        it("produces an exact 1:1 MappingStore when given identical AST inputs", async () => {
            const baseAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_BASE);
            const identicalAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_UNCHANGED);

            const topDown = new GumTreeTopDown(baseAst, identicalAst);
            const mappings = topDown.topDown();

            // Every node in the source should securely map to the destination
            expect(mappings.size()).toBe(baseAst.nodes.size);
        });

        it("maps nothing and produces an empty MappingStore when comparing populated against empty ASTs", async () => {
            const baseAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_BASE);
            const emptyAst = await getAst(LATEX_DOC_FIXTURES.EMPTY);

            const topDown = new GumTreeTopDown(baseAst, emptyAst);
            const mappings = topDown.topDown();

            expect(mappings.size()).toBe(0);
        });
    });

    /**
     * Sub-flow: GumTreeTopDown -> GumTreeBottomUp
     */
    describe("GumTreeTopDown -> GumTreeBottomUp Integration", () => {
        it("preserves the integrity of the TopDown MappingStore when passed into BottomUp", async () => {
            const srcAst = await getAst(LATEX_DOC_FIXTURES.COMPLEX_BASE);
            const dstAst = await getAst(LATEX_DOC_FIXTURES.COMPLEX_REORDERED);

            // Metrics are a required input from earlier in the pipeline
            const srcMetrics = new TreeMetricComputer();
            srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
            const dstMetrics = new TreeMetricComputer();
            dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));

            // Stage 1: TopDown
            const topDown = new GumTreeTopDown(srcAst, dstAst);
            const initialMappings = topDown.topDown();
            const initialSize = initialMappings.size();

            // Stage 2: BottomUp (Handoff)
            const bottomUp = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics);
            const finalMappings = bottomUp.match(
                srcAst.nodes.get(srcAst.rootId)!,
                dstAst.nodes.get(dstAst.rootId)!,
                initialMappings,
            );

            // BottomUp should only ADD mappings, never remove TopDown's deterministic isomorphic mappings
            expect(finalMappings.size()).toBeGreaterThanOrEqual(initialSize);
            expect(finalMappings).toBe(initialMappings);
        });

        it("BottomUp recovers leaf mappings missed by TopDown due to textual changes", async () => {
            const srcAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_BASE);
            const dstAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_MODIFIED);

            const srcMetrics = new TreeMetricComputer();
            srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
            const dstMetrics = new TreeMetricComputer();
            dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));

            const topDown = new GumTreeTopDown(srcAst, dstAst);
            const tdMappings = topDown.topDown();
            const sizeAfterTopDown = tdMappings.size();

            const bottomUp = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics);
            const finalMappings = bottomUp.match(
                srcAst.nodes.get(srcAst.rootId)!,
                dstAst.nodes.get(dstAst.rootId)!,
                tdMappings,
            );

            // Because "Introduction" changed to "Intro", isomorphic hash matching in TopDown fails for the text node.
            // BottomUp should catch it using dice-similarity thresholding.
            expect(finalMappings.size()).toBeGreaterThan(sizeAfterTopDown);
        });
    });

    /**
     * Composite Flow: AST -> GumTreeTopDown -> GumTreeBottomUp
     */
    describe("AST -> GumTreeTopDown -> GumTreeBottomUp End-to-End", () => {
        it("maps a modified document successfully across the entire diffing pipeline", async () => {
            const srcAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_BASE);
            const dstAst = await getAst(LATEX_DOC_FIXTURES.MINIMAL_MODIFIED);

            const srcMetrics = new TreeMetricComputer();
            srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
            const dstMetrics = new TreeMetricComputer();
            dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));

            const topDown = new GumTreeTopDown(srcAst, dstAst);
            const mappings = topDown.topDown();

            const bottomUp = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics);
            const finalMappings = bottomUp.match(
                srcAst.nodes.get(srcAst.rootId)!,
                dstAst.nodes.get(dstAst.rootId)!,
                mappings,
            );

            expect(finalMappings).toBeDefined();
            expect(finalMappings.isSrcMapped(srcAst.rootId)).toBe(true);
            expect(finalMappings.isDstMapped(dstAst.rootId)).toBe(true);
        });

        it("recovers block-level mappings across a structural document reordering", async () => {
            const srcAst = await getAst(LATEX_DOC_FIXTURES.COMPLEX_BASE);
            const dstAst = await getAst(LATEX_DOC_FIXTURES.COMPLEX_REORDERED);

            const srcMetrics = new TreeMetricComputer();
            srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
            const dstMetrics = new TreeMetricComputer();
            dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));

            const topDown = new GumTreeTopDown(srcAst, dstAst);
            const mappings = topDown.topDown();

            const bottomUp = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics);
            const finalMappings = bottomUp.match(
                srcAst.nodes.get(srcAst.rootId)!,
                dstAst.nodes.get(dstAst.rootId)!,
                mappings,
            );

            // Expect high retention of mappings despite the sections flipping order.
            // The algorithm should detect them as 'moved' rather than 'deleted/inserted'.
            // Because they are structurally identical blocks, mapping size should be close to total node size.
            expect(finalMappings.size()).toBeGreaterThan(srcAst.nodes.size * 0.8);
        });
    });
});
