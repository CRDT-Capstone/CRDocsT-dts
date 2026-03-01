import { describe, it, expect, beforeEach } from "@jest/globals";
import { ChawatheScriptGen } from "../treesitter/Actions/EditScript/ChawatheScriptGen.js";
import { ActionType, Delete, Insert, Move, Update } from "../treesitter/Actions/Model/index.js";
import {
    singleNodeTrees,
    identicalTwoLevelTrees,
    updateChildTree,
    insertChildTree,
    deleteChildTree,
    moveChildTree,
    reparentTree,
    combinedActionsTree,
} from "./mocks/ChawatheScriptGen-mocks.js";
import { MappingStore } from "../treesitter/types/GumTree.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function actionTypes(script: ReturnType<ChawatheScriptGen["generate"]>): ActionType[] {
    return script.map((a) => a.type);
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------
describe("ChawatheScriptGen", () => {
    let gen: ChawatheScriptGen;

    beforeEach(() => {
        gen = new ChawatheScriptGen();
    });

    // -----------------------------------------------------------------------
    // Constructor / initial state
    // -----------------------------------------------------------------------
    describe("constructor", () => {
        it("initialises with an empty actions array", () => {
            expect(gen.actions).toEqual([]);
        });

        it("initialises with empty inOrder maps", () => {
            expect(gen.newInOrder.size).toBe(0);
            expect(gen.oldInOrder.size).toBe(0);
        });
    });

    // -----------------------------------------------------------------------
    // Identity (no-change) scenarios
    // -----------------------------------------------------------------------
    describe("generate – identical trees", () => {
        it("produces an empty edit script for a single matched root node", () => {
            const { ms } = singleNodeTrees();
            gen.init(ms);
            expect(gen.generate()).toHaveLength(0);
        });

        it("produces an empty edit script when all nodes are matched with identical text", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            expect(gen.generate()).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Update
    // -----------------------------------------------------------------------
    describe("generate – Update actions", () => {
        it("emits exactly one Update when a matched node's text changes", () => {
            const { ms } = updateChildTree();
            gen.init(ms);
            const script = gen.generate();
            const updates = script.filter((a) => a.type === ActionType.UPDATE);
            expect(updates).toHaveLength(1);
        });

        it("Update carries the new text value", () => {
            const { ms } = updateChildTree();
            gen.init(ms);
            const script = gen.generate();
            const update = script.find((a) => a.type === ActionType.UPDATE) as Update;
            expect(update.value).toBe("bar");
        });

        it("Update targets the original source node id, not the copy", () => {
            const { oldAst, ms } = updateChildTree();
            gen.init(ms);
            const script = gen.generate();
            const update = script.find((a) => a.type === ActionType.UPDATE) as Update;
            expect(oldAst.nodes.has(update.node.id)).toBe(true);
        });

        it("does not emit an Update when text is unchanged", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            const script = gen.generate();
            expect(script.filter((a) => a.type === ActionType.UPDATE)).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Insert
    // -----------------------------------------------------------------------
    describe("generate – Insert actions", () => {
        it("emits an Insert for an unmatched dst node", () => {
            const { ms } = insertChildTree();
            gen.init(ms);
            const script = gen.generate();
            const inserts = script.filter((a) => a.type === ActionType.INSERT);
            expect(inserts).toHaveLength(1);
        });

        it("Insert carries the correct node text from the dst tree", () => {
            const { ms } = insertChildTree();
            gen.init(ms);
            const script = gen.generate();
            const insert = script.find((a) => a.type === ActionType.INSERT) as Insert;
            expect(insert.node.text).toBe("new");
        });

        it("Insert parent is resolved to the original src tree node", () => {
            const { oldAst, ms } = insertChildTree();
            gen.init(ms);
            const script = gen.generate();
            const insert = script.find((a) => a.type === ActionType.INSERT) as Insert;
            expect(oldAst.nodes.has(insert.parent.id)).toBe(true);
        });

        it("Insert position is a non-negative integer", () => {
            const { ms } = insertChildTree();
            gen.init(ms);
            const script = gen.generate();
            const insert = script.find((a) => a.type === ActionType.INSERT) as Insert;
            expect(insert.pos).toBeGreaterThanOrEqual(0);
        });

        it("does not emit an Insert when every dst node is matched", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            expect(gen.generate().filter((a) => a.type === ActionType.INSERT)).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Delete
    // -----------------------------------------------------------------------
    describe("generate – Delete actions", () => {
        it("emits a Delete for each unmatched src node", () => {
            const { ms } = deleteChildTree();
            gen.init(ms);
            const script = gen.generate();
            const deletes = script.filter((a) => a.type === ActionType.DELETE);
            expect(deletes).toHaveLength(1);
        });

        it("Delete carries the original src node", () => {
            const { oldAst, ms } = deleteChildTree();
            gen.init(ms);
            const script = gen.generate();
            const del = script.find((a) => a.type === ActionType.DELETE) as Delete;
            expect(oldAst.nodes.has(del.node.id)).toBe(true);
        });

        it("does not emit a Delete when all src nodes are matched", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            expect(gen.generate().filter((a) => a.type === ActionType.DELETE)).toHaveLength(0);
        });

        it("Deletes appear after all Inserts and Updates in the script (post-order phase)", () => {
            const { ms } = combinedActionsTree();
            gen.init(ms);
            const script = gen.generate();
            const lastNonDelete = script.reduce((idx, a, i) => (a.type !== ActionType.DELETE ? i : idx), -1);
            const firstDelete = script.findIndex((a) => a.type === ActionType.DELETE);
            // Every Delete must come after every non-Delete action
            expect(firstDelete).toBeGreaterThan(lastNonDelete);
        });
    });

    // -----------------------------------------------------------------------
    // Move
    // -----------------------------------------------------------------------
    describe("generate – Move actions", () => {
        it("emits a Move when siblings are reordered under the same parent", () => {
            const { ms } = moveChildTree();
            gen.init(ms);
            const script = gen.generate();
            expect(script.filter((a) => a.type === ActionType.MOVE).length).toBeGreaterThanOrEqual(1);
        });

        it("emits a Move when a node is reparented to a different node", () => {
            const { ms } = reparentTree();
            gen.init(ms);
            const script = gen.generate();
            expect(script.filter((a) => a.type === ActionType.MOVE).length).toBeGreaterThanOrEqual(1);
        });

        it("Move target parent is resolved to an original AST node", () => {
            const { oldAst, newAst, ms } = reparentTree();
            gen.init(ms);
            const script = gen.generate();
            const move = script.find((a) => a.type === ActionType.MOVE) as Move;
            const knownId = oldAst.nodes.has(move.parent.id) || newAst.nodes.has(move.parent.id);
            expect(knownId).toBe(true);
        });

        it("does not emit a Move when tree structure is identical", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            expect(gen.generate().filter((a) => a.type === ActionType.MOVE)).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Combined scenarios
    // -----------------------------------------------------------------------
    describe("generate – combined actions", () => {
        it("emits Update, Insert, and Delete in the same script when required", () => {
            const { ms } = combinedActionsTree();
            gen.init(ms);
            const types = actionTypes(gen.generate());
            expect(types).toContain(ActionType.UPDATE);
            expect(types).toContain(ActionType.INSERT);
            expect(types).toContain(ActionType.DELETE);
        });

        it("returns the same script on repeated calls to generate() without re-init", () => {
            const { ms } = combinedActionsTree();
            gen.init(ms);
            const first = gen.generate().map((a) => ({ type: a.type, id: a.node.id }));
            const second = gen.generate().map((a) => ({ type: a.type, id: a.node.id }));
            const third = gen.generate().map((a) => ({ type: a.type, id: a.node.id }));
            expect(first).toEqual(second);
            expect(second).toEqual(third);
        });
    });

    // -----------------------------------------------------------------------
    // computeActions (public API convenience wrapper)
    // -----------------------------------------------------------------------
    describe("computeActions", () => {
        it("returns the same result as calling init then generate separately", () => {
            const { ms } = combinedActionsTree();

            const genA = new ChawatheScriptGen();
            genA.init(ms);
            const expected = genA.generate().map((a) => ({ type: a.type, id: a.node.id }));

            const genB = new ChawatheScriptGen();
            const actual = genB.computeActions(ms).map((a) => ({ type: a.type, id: a.node.id }));

            expect(actual).toEqual(expected);
        });

        it("returns an empty script for identical trees", () => {
            const { ms } = identicalTwoLevelTrees();
            expect(gen.computeActions(ms)).toHaveLength(0);
        });

        it("accepts a fresh MappingStore with zero mappings and returns only Deletes", () => {
            // Build a src tree with two nodes but map nothing to dst
            const { oldAst } = deleteChildTree();
            const emptyNewAst = { rootId: "n-root", nodes: new Map() };
            // dst root must exist for BFS to start; map root so root is never an orphan in dst
            const newRoot = { id: "n-root", type: "source_file", text: "", parentId: null, childrenIds: [] } as any;
            emptyNewAst.nodes.set("n-root", newRoot);

            const ms = new MappingStore(oldAst, emptyNewAst);
            // only map the roots so generate can traverse dst
            ms.addMapping("o-root", "n-root");
            // o-keep and o-del are unmapped → both should produce Delete
            const script = gen.computeActions(ms);
            const deletes = script.filter((a) => a.type === ActionType.DELETE);
            expect(deletes.length).toBeGreaterThanOrEqual(2);
        });
    });

    // -----------------------------------------------------------------------
    // init – internal state wiring
    // -----------------------------------------------------------------------
    describe("init", () => {
        it("builds a cpyMappings that mirrors the original mappings for all src nodes", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            // After init, every og mapping should be reflected in cpyMappings via the id
            // translation. We verify indirectly: generate() on an identical tree is empty.
            expect(gen.generate()).toHaveLength(0);
        });

        it("re-initialising with a new MappingStore resets prior state", () => {
            const { ms: ms1 } = combinedActionsTree();
            gen.init(ms1);
            gen.generate();

            const { ms: ms2 } = identicalTwoLevelTrees();
            gen.init(ms2);
            expect(gen.generate()).toHaveLength(0);
        });

        it("ogToCpyIdMap and cpyToOgIdMap are inverse of each other", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            for (const [ogId, cpyId] of gen.ogToCpyIdMap) {
                expect(gen.cpyToOgIdMap.get(cpyId)).toBe(ogId);
            }
        });

        it("cpyOldAst is a deep clone – mutating it does not affect ogOldAst", () => {
            const { ms } = identicalTwoLevelTrees();
            gen.init(ms);
            const cpyRoot = gen.cpyOldAst.nodes.get(gen.cpyOldAst.rootId)!;
            const originalText = gen.ogOldAst.nodes.get(gen.ogOldAst.rootId)!.text;
            cpyRoot.text = "mutated";
            expect(gen.ogOldAst.nodes.get(gen.ogOldAst.rootId)!.text).toBe(originalText);
        });
    });

    // -----------------------------------------------------------------------
    // Error / edge-case paths
    // -----------------------------------------------------------------------
    describe("error and edge-case handling", () => {
        it("throws when getCpyNode is called with an unknown id (via generate on corrupt tree)", () => {
            // Manually corrupt cpyOldAst after init to trigger the internal guard
            const { ms } = singleNodeTrees();
            gen.init(ms);
            gen.ogOldAst.nodes.delete(gen.ogOldAst.rootId);
            expect(() => gen.generate()).toThrow();
        });

        it("throws when resolveOrigNode cannot find the id in either tree", () => {
            const { ms } = singleNodeTrees();
            gen.init(ms);
            // Access the private method via bracket notation for the edge-case test
            expect(() => (gen as any).resolveOrigNode("totally-unknown-id")).toThrow(/Cannot resolve original AstNode/);
        });

        it("handles a tree where the root is the only node without errors", () => {
            const { ms } = singleNodeTrees();
            expect(() => gen.computeActions(ms)).not.toThrow();
        });

        it("emits no actions for a root-only tree where root text is identical", () => {
            const { ms } = singleNodeTrees();
            expect(gen.computeActions(ms)).toHaveLength(0);
        });
    });
});
