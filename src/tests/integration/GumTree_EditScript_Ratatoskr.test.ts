// import { describe, it, expect, beforeAll, afterEach, afterAll } from "@jest/globals";
// import { Parser, Tree } from "web-tree-sitter";
// import { getParser } from "../unit/mocks/BragiAST-mocks.js";
// import { parseCST, BragiAST } from "../../treesitter/types/AST.js";
// import { GumTreeTopDown } from "../../treesitter/GumTreeTopDown.js";
// import { GumTreeBottomUp } from "../../treesitter/GumTreeBottomUp.js";
// import { TreeMetricComputer } from "../../treesitter/GumTree/TreeMetricComputer.js";
// import { SimplifiedChawatheScriptGen } from "../../treesitter/Actions/EditScript/SimplifiedChawatheScriptGen.js";
// import { Ratatoskr } from "../../treesitter/COAST/Ratatoskr/index.js";
// import { Registry } from "../../treesitter/COAST/Registry/index.js";
// import { makeFugueTree } from "../unit/mocks/FugueTree-mocks.js";
// import { ActionType, TreeInsert, TreeDelete } from "../../treesitter/Actions/Model/Action.js";
// import { RATATOSKR_FIXTURES } from "./mocks/GumTree_EditScript_Ratatoskr-mocks.js";
//
// describe("Ratatoskr Editing Pipeline Integration", () => {
//     let parser: Parser;
//     let csts: Tree[] = [];
//
//     beforeAll(async () => {
//         parser = await getParser();
//     });
//
//     // Enforce strict WASM memory teardown to prevent Zone OOM crashes
//     afterEach(() => {
//         if (csts.length > 0) {
//             for (const cst of csts) {
//                 cst.delete();
//             }
//             csts = [];
//         }
//     });
//
//     afterAll(() => {
//         if (parser) {
//             parser.delete();
//         }
//     });
//
//     /**
//      * Helper to safely generate a BragiAST from source text,
//      * tracking the underlying CST for deterministic memory cleanup.
//      */
//     const createAST = (sourceCode: string): BragiAST => {
//         const cst = parser.parse(sourceCode);
//         if (!cst || !cst.rootNode) {
//             throw new Error("Parser failed to return a valid CST");
//         }
//         csts.push(cst);
//         return parseCST(cst.rootNode);
//     };
//
//     /**
//      * Sub-flow: GumTree -> SimplifiedChawatheScriptGen
//      */
//     describe("GumTreeTopDown -> GumTreeBottomUp -> SimplifiedChawatheScriptGen Integration", () => {
//         it("consolidates cascading insertions into a single TreeInsert action for new subtrees", () => {
//             const srcAst = createAST(RATATOSKR_FIXTURES.BASE);
//             const dstAst = createAST(RATATOSKR_FIXTURES.APPENDED);
//
//             const srcMetrics = new TreeMetricComputer();
//             srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
//             const dstMetrics = new TreeMetricComputer();
//             dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));
//
//             const mappings = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics).match(
//                 srcAst.nodes.get(srcAst.rootId)!,
//                 dstAst.nodes.get(dstAst.rootId)!,
//                 new GumTreeTopDown(srcAst, dstAst).topDown(),
//             );
//
//             const scriptGen = new SimplifiedChawatheScriptGen();
//             const editScript = scriptGen.computeActions(mappings);
//
//             // Data Transformation Correctness:
//             // Instead of returning discrete Insert actions for the structural section nodes,
//             // the Simplifier should collapse the entirety of the new subtree into a TreeInsert.
//             const treeInserts = editScript.filter((a) => a.type === ActionType.TREE_INSERT);
//             expect(treeInserts.length).toBeGreaterThan(0);
//
//             // The root of the newly added section should be the target of the TreeInsert
//             const newSectionNode = Array.from(dstAst.nodes.values()).find(
//                 (n) => n.type === "section" && n.text.includes("Methods"),
//             );
//             const matchingAction = treeInserts.find((a) => (a as TreeInsert).node.id === newSectionNode?.id);
//             expect(matchingAction).toBeDefined();
//         });
//
//         it("consolidates cascading deletions of document fragments into a single TreeDelete action", () => {
//             const srcAst = createAST(RATATOSKR_FIXTURES.BASE);
//             const dstAst = createAST(RATATOSKR_FIXTURES.DELETED);
//
//             const srcMetrics = new TreeMetricComputer();
//             srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
//             const dstMetrics = new TreeMetricComputer();
//             dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));
//
//             const mappings = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics).match(
//                 srcAst.nodes.get(srcAst.rootId)!,
//                 dstAst.nodes.get(dstAst.rootId)!,
//                 new GumTreeTopDown(srcAst, dstAst).topDown(),
//             );
//
//             const editScript = new SimplifiedChawatheScriptGen().computeActions(mappings);
//
//             const treeDeletes = editScript.filter((a) => a.type === ActionType.TREE_DELETE);
//             expect(treeDeletes.length).toBeGreaterThan(0);
//         });
//     });
//
//     /**
//      * Sub-flow: SimplifiedChawatheScriptGen -> Ratatoskr
//      */
//     describe("SimplifiedChawatheScriptGen -> Ratatoskr Integration", () => {
//         it("halts processing and throws a descriptive error when translating Updates lacking a local Registry Anchor", () => {
//             const srcAst = createAST(RATATOSKR_FIXTURES.BASE);
//             const dstAst = createAST(RATATOSKR_FIXTURES.UPDATED);
//
//             const srcMetrics = new TreeMetricComputer();
//             srcMetrics.buildMetrics(srcAst, srcAst.nodes.get(srcAst.rootId));
//             const dstMetrics = new TreeMetricComputer();
//             dstMetrics.buildMetrics(dstAst, dstAst.nodes.get(dstAst.rootId));
//
//             const mappings = new GumTreeBottomUp(srcAst, dstAst, srcMetrics, dstMetrics).match(
//                 srcAst.nodes.get(srcAst.rootId)!,
//                 dstAst.nodes.get(dstAst.rootId)!,
//                 new GumTreeTopDown(srcAst, dstAst).topDown(),
//             );
//
//             const editScript = new SimplifiedChawatheScriptGen().computeActions(mappings);
//
//             // Error Handling Across Boundaries:
//             // We intentionally provide an uninitialized Registry to Ratatoskr.
//             // Operations that modify existing AST nodes (like Update/Move) require existing CRDT spans.
//             const localFugue = makeFugueTree();
//             const registry = new Registry();
//             const ratatoskr = new Ratatoskr(localFugue, registry, dstAst);
//
//             expect(() => ratatoskr.translate(editScript)).toThrow("Update target not in registry");
//         });
//     });
//
//     /**
//      * Composite Flow: GumTree -> ScriptGen -> Ratatoskr
//      */
//     describe("GumTreeTopDown -> GumTreeBottomUp -> SimplifiedChawatheScriptGen -> Ratatoskr Integration", () => {
//         it("translates AST modifications into valid network messages while properly mutating the local CRDT state and Registry", () => {
//             const localFugue = makeFugueTree();
//             const localRegistry = new Registry();
//
//             // ---------------------------------------------------------
//             // Stage 1: Bootstrap the Document State
//             // We run an initial pipeline to populate the local FugueTree and Registry anchors
//             // ---------------------------------------------------------
//             const emptyAst = createAST(RATATOSKR_FIXTURES.DELETED);
//             const baseAst = createAST(RATATOSKR_FIXTURES.BASE);
//
//             const bSrcMetrics = new TreeMetricComputer();
//             bSrcMetrics.buildMetrics(emptyAst, emptyAst.nodes.get(emptyAst.rootId));
//             const bDstMetrics = new TreeMetricComputer();
//             bDstMetrics.buildMetrics(baseAst, baseAst.nodes.get(baseAst.rootId));
//
//             const bootstrapMappings = new GumTreeBottomUp(emptyAst, baseAst, bSrcMetrics, bDstMetrics).match(
//                 emptyAst.nodes.get(emptyAst.rootId)!,
//                 baseAst.nodes.get(baseAst.rootId)!,
//                 new GumTreeTopDown(emptyAst, baseAst).topDown(),
//             );
//
//             const bootstrapScript = new SimplifiedChawatheScriptGen().computeActions(bootstrapMappings);
//             const bootstrapRatatoskr = new Ratatoskr(localFugue, localRegistry, baseAst);
//
//             // This locally mutates the FugueTree and registers the new spans
//             bootstrapRatatoskr.translate(bootstrapScript);
//
//             // Verify Stage 1 Order of Operations & State Setup
//             expect(localFugue.observe().replace(/\s+/g, "")).toBe(RATATOSKR_FIXTURES.BASE.replace(/\s+/g, ""));
//             const initialRegistrySize = Array.from((localRegistry as any).anchors?.keys() || []).length;
//             expect(initialRegistrySize).toBeGreaterThan(0);
//
//             // ---------------------------------------------------------
//             // Stage 2: Compute and Translate the Modifying EditScript
//             // ---------------------------------------------------------
//             const appendedAst = createAST(RATATOSKR_FIXTURES.APPENDED);
//             const dstMetrics = new TreeMetricComputer();
//             dstMetrics.buildMetrics(appendedAst, appendedAst.nodes.get(appendedAst.rootId));
//
//             const mappings = new GumTreeBottomUp(baseAst, appendedAst, bDstMetrics, dstMetrics).match(
//                 baseAst.nodes.get(baseAst.rootId)!,
//                 appendedAst.nodes.get(appendedAst.rootId)!,
//                 new GumTreeTopDown(baseAst, appendedAst).topDown(),
//             );
//
//             const editScript = new SimplifiedChawatheScriptGen().computeActions(mappings);
//             const ratatoskr = new Ratatoskr(localFugue, localRegistry, appendedAst);
//
//             // Trigger the primary boundary handoff
//             const outputMessages = ratatoskr.translate(editScript);
//
//             // 1. Data Transformation Output Correctness:
//             // Ensures Ratatoskr yields syntactically correct FugueMessages formatted for COAST.
//             expect(outputMessages.length).toBeGreaterThan(0);
//             expect(outputMessages[0].coastTxId).toBeDefined();
//             expect(outputMessages[0].coastOpType).toBeDefined();
//
//             // 2. State Propagation:
//             // Validates that Ratatoskr correctly maintains its internal audit log.
//             expect(ratatoskr.pastActions.length).toBe(1);
//             expect(ratatoskr.pastActions[0].editScript).toBe(editScript);
//
//             // 3. Side Effects on Internal Collaborators (FugueTree):
//             // The LOCAL FugueTree must immediately reflect the modifications.
//             const finalString = localFugue.observe();
//             expect(finalString.replace(/\s+/g, "")).toBe(RATATOSKR_FIXTURES.APPENDED.replace(/\s+/g, ""));
//
//             // 4. Side Effects on Internal Collaborators (Registry):
//             // The Registry must be expanded to track the AST nodes corresponding to the new content.
//             const finalRegistrySize = Array.from((localRegistry as any).anchors?.keys() || []).length;
//             expect(finalRegistrySize).toBeGreaterThan(initialRegistrySize);
//         });
//     });
// });
