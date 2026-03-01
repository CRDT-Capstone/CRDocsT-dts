import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { SimplifiedChawatheScriptGen } from "../treesitter/Actions/EditScript/SimplifiedChawatheScriptGen.js";
import { ChawatheScriptGen } from "../treesitter/Actions/EditScript/ChawatheScriptGen.js";
import { ActionType, Delete, Insert, Move, TreeDelete, TreeInsert, Update } from "../treesitter/Actions/Model/index.js";
import {
    makeNode,
    buildActions,
    makeSingleInsertScenario,
    makeSingleDeleteScenario,
    makeIdenticalSingleNodeScenario,
    makeSubtreeInsertScenario,
    makeSubtreeDeleteScenario,
    makePartialSubtreeInsertScenario,
    makePartialSubtreeDeleteScenario,
    makeMoveAndUpdateScenario,
    makeDeepSubtreeInsertScenario,
    makeDeepSubtreeDeleteScenario,
} from "./mocks/SimplifiedChawatheScriptGen-mocks.js";
import { makeAst } from "./mocks/ChawatheScriptGen-mocks.js";
import { MappingStore } from "../treesitter/types/GumTree.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Replace ChawatheScriptGen.prototype.computeActions with a spy that returns
 * the provided actions, so SimplifiedChawatheScriptGen is tested in isolation.
 */
function spyOnChawathe(actions: ReturnType<typeof buildActions>) {
    return jest.spyOn(ChawatheScriptGen.prototype, "computeActions").mockReturnValue(actions);
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("SimplifiedChawatheScriptGen", () => {
    let gen: SimplifiedChawatheScriptGen;

    beforeEach(() => {
        jest.restoreAllMocks();
        gen = new SimplifiedChawatheScriptGen();
    });

    // -----------------------------------------------------------------------
    // computeActions delegates to ChawatheScriptGen
    // -----------------------------------------------------------------------

    describe("computeActions – delegation", () => {
        it("delegates to ChawatheScriptGen.computeActions with the provided MappingStore", () => {
            const { ms } = makeIdenticalSingleNodeScenario();
            const spy = spyOnChawathe([]);
            gen.computeActions(ms);
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy).toHaveBeenCalledWith(ms);
        });

        it("returns an EditScript (array)", () => {
            const { ms } = makeIdenticalSingleNodeScenario();
            spyOnChawathe([]);
            const result = gen.computeActions(ms);
            expect(Array.isArray(result)).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // No simplification possible
    // -----------------------------------------------------------------------

    describe("no-op passthrough cases", () => {
        it("returns an empty script unchanged when ChawatheScriptGen produces no actions", () => {
            const { ms } = makeIdenticalSingleNodeScenario();
            spyOnChawathe([]);
            expect(gen.computeActions(ms)).toEqual([]);
        });

        it("preserves Move actions without modification", () => {
            const { ms, oldAst, newAst } = makeMoveAndUpdateScenario();
            // Let the real algorithm run for this scenario (Move + Update expected)
            const result = gen.computeActions(ms);
            const moveActions = result.filter((a) => a.type === ActionType.MOVE);
            expect(moveActions.length).toBeGreaterThan(0);
        });

        it("preserves Update actions without modification", () => {
            const { ms } = makeMoveAndUpdateScenario();
            const result = gen.computeActions(ms);
            const updateActions = result.filter((a) => a.type === ActionType.UPDATE);
            expect(updateActions.length).toBeGreaterThan(0);
        });

        it("does not add or remove actions when no Insert or Delete is present", () => {
            const root = makeNode("root", null, []);
            const parent = makeNode("parent", null, []);
            const actions = buildActions([
                { kind: "move", node: root, parent, pos: 0 },
                { kind: "update", node: root, value: "new" },
            ]);
            const { ms } = makeIdenticalSingleNodeScenario();
            spyOnChawathe(actions);
            const result = gen.computeActions(ms);
            expect(result).toHaveLength(2);
            expect(result[0].type).toBe(ActionType.MOVE);
            expect(result[1].type).toBe(ActionType.UPDATE);
        });

        it("retains a lone Insert for a leaf node that has no inserted parent", () => {
            const { ms } = makeSingleInsertScenario();
            const result = gen.computeActions(ms);
            const inserts = result.filter((a) => a instanceof Insert);
            expect(inserts).toHaveLength(1);
            expect(inserts[0].type).toBe(ActionType.INSERT);
        });

        it("retains a lone Delete for a leaf node that has no deleted parent", () => {
            const { ms } = makeSingleDeleteScenario();
            const result = gen.computeActions(ms);
            const deletes = result.filter((a) => a instanceof Delete);
            expect(deletes).toHaveLength(1);
            expect(deletes[0].type).toBe(ActionType.DELETE);
        });
    });

    // -----------------------------------------------------------------------
    // Insert → TreeInsert promotion
    // -----------------------------------------------------------------------

    describe("Insert → TreeInsert promotion", () => {
        it("replaces the root Insert with a single TreeInsert when all descendants are also inserted", () => {
            const { ms } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const treeInserts = result.filter((a) => a instanceof TreeInsert);
            const inserts = result.filter((a) => a instanceof Insert);
            expect(treeInserts).toHaveLength(1);
            expect(inserts).toHaveLength(0);
        });

        it("sets TreeInsert node to the subtree root node", () => {
            const { ms, newAst } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const ti = result.find((a) => a instanceof TreeInsert) as TreeInsert;
            expect(ti.node.id).toBe("parent");
        });

        it("preserves parent and position on the promoted TreeInsert", () => {
            const { ms } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const ti = result.find((a) => a instanceof TreeInsert) as TreeInsert;
            expect(ti.parent).toBeDefined();
            expect(typeof ti.pos).toBe("number");
        });

        it("removes interior Insert nodes that are descendants of the promoted TreeInsert root", () => {
            const { ms } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const inserts = result.filter((a) => a instanceof Insert);
            expect(inserts).toHaveLength(0);
        });

        it("does not promote Insert to TreeInsert when the subtree is only partially inserted", () => {
            const { ms } = makePartialSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const treeInserts = result.filter((a) => a instanceof TreeInsert);
            expect(treeInserts).toHaveLength(0);
        });

        it("promotes only the deepest fully-inserted subtree root in a deep chain", () => {
            const { ms } = makeDeepSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const treeInserts = result.filter((a) => a instanceof TreeInsert);
            const inserts = result.filter((a) => a instanceof Insert);
            expect(treeInserts).toHaveLength(1);
            expect(treeInserts[0].node.id).toBe("l1");
            expect(inserts).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Delete → TreeDelete promotion
    // -----------------------------------------------------------------------

    describe("Delete → TreeDelete promotion", () => {
        it("replaces the root Delete with a single TreeDelete when all descendants are also deleted", () => {
            const { ms } = makeSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            const treeDeletes = result.filter((a) => a instanceof TreeDelete);
            const deletes = result.filter((a) => a instanceof Delete);
            expect(treeDeletes).toHaveLength(1);
            expect(deletes).toHaveLength(0);
        });

        it("sets TreeDelete node to the subtree root node", () => {
            const { ms } = makeSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            const td = result.find((a) => a instanceof TreeDelete) as TreeDelete;
            expect(td.node.id).toBe("parent");
        });

        it("removes interior Delete nodes that are descendants of the promoted TreeDelete root", () => {
            const { ms } = makeSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            const deletes = result.filter((a) => a instanceof Delete);
            expect(deletes).toHaveLength(0);
        });

        it("does not promote Delete to TreeDelete when the subtree is only partially deleted", () => {
            const { ms } = makePartialSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            const treeDeletes = result.filter((a) => a instanceof TreeDelete);
            expect(treeDeletes).toHaveLength(0);
        });

        it("promotes only the deepest fully-deleted subtree root in a deep chain", () => {
            const { ms } = makeDeepSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            const treeDeletes = result.filter((a) => a instanceof TreeDelete);
            const deletes = result.filter((a) => a instanceof Delete);
            expect(treeDeletes).toHaveLength(1);
            expect(treeDeletes[0].node.id).toBe("l1");
            expect(deletes).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Mixed insert + delete in a single script
    // -----------------------------------------------------------------------

    describe("mixed Insert and Delete simplification", () => {
        it("simplifies inserts and deletes independently in the same script", () => {
            // Manually inject a script with a fully-inserted subtree AND a fully-deleted subtree.
            const srcRoot = makeNode("root", null, []);
            const dstRoot = makeNode("root", null, ["newParent"]);
            const dstNewParent = makeNode("newParent", "root", ["newChild"]);
            const dstNewChild = makeNode("newChild", "newParent", []);

            const oldAst = makeAst("root", [srcRoot]);
            const newAst = makeAst("root", [dstRoot, dstNewParent, dstNewChild]);
            const ms = new MappingStore(oldAst, newAst);
            ms.addMapping("root", "root");

            // Craft a synthetic Chawathe output:
            //   Insert(newParent), Insert(newChild), Delete(deadParent), Delete(deadChild)
            const deadParent = makeNode("deadParent", "root", ["deadChild"]);
            const deadChild = makeNode("deadChild", "deadParent", []);

            const syntheticActions = buildActions([
                { kind: "insert", node: dstNewParent, parent: dstRoot, pos: 0 },
                { kind: "insert", node: dstNewChild, parent: dstNewParent, pos: 0 },
                { kind: "delete", node: deadChild },
                { kind: "delete", node: deadParent },
            ]);
            spyOnChawathe(syntheticActions);

            const result = gen.computeActions(ms);
            const treeInserts = result.filter((a) => a instanceof TreeInsert);
            const treeDeletes = result.filter((a) => a instanceof TreeDelete);
            const inserts = result.filter((a) => a instanceof Insert);
            const deletes = result.filter((a) => a instanceof Delete);

            expect(treeInserts).toHaveLength(1);
            expect(treeDeletes).toHaveLength(1);
            expect(inserts).toHaveLength(0);
            expect(deletes).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Splice ordering correctness
    // -----------------------------------------------------------------------

    describe("splice ordering during replacement", () => {
        it("processes replacements in descending index order so earlier splice positions remain valid", () => {
            // Two sibling subtrees both fully inserted; whichever is at a higher
            // index in the actions array must be replaced first.
            const root = makeNode("root", null, []);
            const p1 = makeNode("p1", "root", ["c1"]);
            const c1 = makeNode("c1", "p1", []);
            const p2 = makeNode("p2", "root", ["c2"]);
            const c2 = makeNode("c2", "p2", []);

            const actions = buildActions([
                { kind: "insert", node: p1, parent: root, pos: 0 },
                { kind: "insert", node: c1, parent: p1, pos: 0 },
                { kind: "insert", node: p2, parent: root, pos: 1 },
                { kind: "insert", node: c2, parent: p2, pos: 0 },
            ]);

            // newAst must contain all inserted nodes so allDescendantsInserted resolves correctly
            const newAst = makeAst("root", [
                makeNode("root", null, ["p1", "p2"]),
                makeNode("p1", "root", ["c1"]),
                makeNode("c1", "p1", []),
                makeNode("p2", "root", ["c2"]),
                makeNode("c2", "p2", []),
            ]);
            const oldAst = makeAst("root", [root]);
            const ms = new MappingStore(oldAst, newAst);
            ms.addMapping("root", "root");

            spyOnChawathe(actions);
            const result = gen.computeActions(ms);

            // Each top-level inserted node should be promoted; children removed.
            const treeInserts = result.filter((a) => a instanceof TreeInsert);
            expect(treeInserts).toHaveLength(2);
            expect(result.filter((a) => a instanceof Insert)).toHaveLength(0);
        });

        it("applies delete replacements in descending index order without corrupting the script", () => {
            const root = makeNode("root", null, []);
            const p1 = makeNode("p1", "root", ["c1"]);
            const c1 = makeNode("c1", "p1", []);
            const p2 = makeNode("p2", "root", ["c2"]);
            const c2 = makeNode("c2", "p2", []);

            const actions = buildActions([
                { kind: "delete", node: c1 },
                { kind: "delete", node: p1 },
                { kind: "delete", node: c2 },
                { kind: "delete", node: p2 },
            ]);

            const oldAst = makeAst("root", [
                makeNode("root", null, ["p1", "p2"]),
                makeNode("p1", "root", ["c1"]),
                makeNode("c1", "p1", []),
                makeNode("p2", "root", ["c2"]),
                makeNode("c2", "p2", []),
            ]);
            const newAst = makeAst("root", [makeNode("root", null, [])]);
            const ms = new MappingStore(oldAst, newAst);
            ms.addMapping("root", "root");

            spyOnChawathe(actions);
            const result = gen.computeActions(ms);

            const treeDeletes = result.filter((a) => a instanceof TreeDelete);
            expect(treeDeletes).toHaveLength(2);
            expect(result.filter((a) => a instanceof Delete)).toHaveLength(0);
        });
    });

    // -----------------------------------------------------------------------
    // Edge: leaf Insert node (no children) — no promotion to TreeInsert
    // -----------------------------------------------------------------------

    describe("leaf node boundary cases", () => {
        it("does not promote an Insert to TreeInsert when the inserted node has no children", () => {
            const root = makeNode("root", null, []);
            const leaf = makeNode("leaf", "root", []);

            const actions = buildActions([{ kind: "insert", node: leaf, parent: root, pos: 0 }]);
            const newAst = makeAst("root", [makeNode("root", null, ["leaf"]), makeNode("leaf", "root", [])]);
            const oldAst = makeAst("root", [root]);
            const ms = new MappingStore(oldAst, newAst);
            ms.addMapping("root", "root");

            spyOnChawathe(actions);
            const result = gen.computeActions(ms);

            expect(result.filter((a) => a instanceof TreeInsert)).toHaveLength(0);
            expect(result.filter((a) => a instanceof Insert)).toHaveLength(1);
        });

        it("does not promote a Delete to TreeDelete when the deleted node has no children", () => {
            const root = makeNode("root", null, ["leaf"]);
            const leaf = makeNode("leaf", "root", []);

            const actions = buildActions([{ kind: "delete", node: leaf }]);
            const oldAst = makeAst("root", [root, leaf]);
            const newAst = makeAst("root", [makeNode("root", null, [])]);
            const ms = new MappingStore(oldAst, newAst);
            ms.addMapping("root", "root");

            spyOnChawathe(actions);
            const result = gen.computeActions(ms);

            expect(result.filter((a) => a instanceof TreeDelete)).toHaveLength(0);
            expect(result.filter((a) => a instanceof Delete)).toHaveLength(1);
        });
    });

    // -----------------------------------------------------------------------
    // Returned-value correctness
    // -----------------------------------------------------------------------

    describe("returned values", () => {
        it("returns the same array instance that was produced by ChawatheScriptGen (mutated in place)", () => {
            const { ms } = makeIdenticalSingleNodeScenario();
            const actions = buildActions([]);
            spyOnChawathe(actions);
            const result = gen.computeActions(ms);
            expect(result).toBe(actions);
        });

        it("TreeInsert carries the same node reference as the original Insert", () => {
            const { ms, newAst } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            const ti = result.find((a) => a instanceof TreeInsert) as TreeInsert;
            expect(ti.node.id).toBe("parent");
        });

        it("TreeDelete carries the same node reference as the original Delete", () => {
            const { ms } = makeSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            const td = result.find((a) => a instanceof TreeDelete) as TreeDelete;
            expect(td.node.id).toBe("parent");
        });

        it("produces correct action types in output", () => {
            const { ms } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            for (const action of result) {
                expect([
                    ActionType.INSERT,
                    ActionType.DELETE,
                    ActionType.MOVE,
                    ActionType.UPDATE,
                    ActionType.TREE_INSERT,
                    ActionType.TREE_DELETE,
                ]).toContain(action.type);
            }
        });
    });

    // -----------------------------------------------------------------------
    // Integration: real ChawatheScriptGen (no mocking)
    // -----------------------------------------------------------------------

    describe("integration with real ChawatheScriptGen", () => {
        it("handles an empty tree pair without throwing", () => {
            const { ms } = makeIdenticalSingleNodeScenario();
            expect(() => gen.computeActions(ms)).not.toThrow();
        });

        it("produces no actions for two identical single-node trees", () => {
            const { ms } = makeIdenticalSingleNodeScenario();
            const result = gen.computeActions(ms);
            expect(result).toHaveLength(0);
        });

        it("produces a TreeInsert when a full subtree is inserted", () => {
            const { ms } = makeSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            expect(result.some((a) => a instanceof TreeInsert)).toBe(true);
        });

        it("produces a TreeDelete when a full subtree is deleted", () => {
            const { ms } = makeSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            expect(result.some((a) => a instanceof TreeDelete)).toBe(true);
        });

        it("produces no TreeInsert or TreeDelete for a partially-inserted subtree", () => {
            const { ms } = makePartialSubtreeInsertScenario();
            const result = gen.computeActions(ms);
            expect(result.some((a) => a instanceof TreeInsert)).toBe(false);
            expect(result.some((a) => a instanceof TreeDelete)).toBe(false);
        });

        it("produces no TreeInsert or TreeDelete for a partially-deleted subtree", () => {
            const { ms } = makePartialSubtreeDeleteScenario();
            const result = gen.computeActions(ms);
            expect(result.some((a) => a instanceof TreeInsert)).toBe(false);
            expect(result.some((a) => a instanceof TreeDelete)).toBe(false);
        });
    });
});
