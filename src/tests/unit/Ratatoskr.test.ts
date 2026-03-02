import { Parser, Tree } from "web-tree-sitter";
import { AstNode, BragiAST, newParser, Registry } from "../../treesitter.js";
import { ActionType, TreeInsert, Delete, Update, Move } from "../../treesitter/Actions/Model/index.js";
import { Ratatoskr } from "../../treesitter/COAST/Ratatoskr/index.js";
import { getParser } from "./mocks/BragiAST-mocks.js";
import { FugueTree, ID } from "../../dts/index.js";
import { bragiAstFromFugueTree, fugueTreeWithContent } from "./mocks/Ratatoskr-mocks.js";
import { makeMockRegistry } from "./mocks/Nidhoggr-mocks.js";
import { describe, expect, it, beforeAll, beforeEach, afterEach, jest } from "@jest/globals";

describe("Ratatoskr", () => {
    let fugue: FugueTree;
    let ast: BragiAST;
    let ratatoskr: Ratatoskr;
    let registry: Registry;
    let parser: Parser;

    let insertSpy: jest.SpiedFunction<FugueTree["insertMultiple"]>;
    let deleteSpy: jest.SpiedFunction<FugueTree["deleteMultiple"]>;

    const originalInsertMultiple = FugueTree.prototype.insertMultiple;
    const originalDeleteMultiple = FugueTree.prototype.deleteMultiple;

    const dummyId: ID = { counter: 10, sender: "dummy-sender" };

    afterAll(() => {
        if (parser) {
            parser.delete();
        }
    });

    beforeAll(async () => {
        parser = await getParser();
    });

    beforeEach(() => {
        fugue = fugueTreeWithContent(`\\documentclass{article}
                \\begin{document}
                Hello, World!
                \\end{document}
`);

        ast = bragiAstFromFugueTree(fugue, parser);
        registry = new Registry();
        ratatoskr = new Ratatoskr(fugue, ast, registry);

        insertSpy = jest.spyOn(fugue, "insertMultiple");
        deleteSpy = jest.spyOn(fugue, "deleteMultiple");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("TREE_INSERT", () => {
        it("should insert text into the FugueTree and register the new node", () => {
            const newNode: AstNode = {
                id: "new-node-id",
                type: "text",
                text: " Brand New Text!",
                childrenIds: [],
            } as any;

            const editScript = [
                {
                    type: ActionType.TREE_INSERT,
                    pos: 40,
                    node: newNode,
                } as TreeInsert,
            ];

            const msgs = ratatoskr.translate(editScript);

            expect(insertSpy).toHaveBeenCalledWith(40, " Brand New Text!");

            const anchor = ratatoskr.registry.get("new-node-id");
            expect(anchor).toBeDefined();
            expect(anchor?.length).toBe(16);

            expect(msgs[0].coastOpType).toBe("ADD");
        });
    });

    describe("DELETE", () => {
        it("should delete text from the FugueTree and remove it from the registry", () => {
            const textNode = Array.from(ast.nodes.values()).find((n) => n.text.includes("Hello"));
            if (!textNode) throw new Error("Could not find text node in AST");

            ratatoskr.registry.register(textNode.id, { startId: dummyId, length: 13 });

            jest.spyOn(fugue, "getById").mockReturnValue({ id: dummyId, value: "H", isDeleted: false } as any);
            jest.spyOn(fugue, "getVisibleIndex").mockReturnValue(40);

            const editScript = [
                {
                    type: ActionType.DELETE,
                    node: textNode,
                } as Delete,
            ];

            ratatoskr.translate(editScript);

            expect(deleteSpy).toHaveBeenCalledWith(40, 13);
            expect(ratatoskr.registry.get(textNode.id)).toBeUndefined();
        });

        it("should return [] and not throw when deleting an unregistered node", () => {
            const unregisteredNode = { id: "ghost-id", type: "text", text: "x", childrenIds: [] } as any;
            const msgs = ratatoskr.translate([{ type: ActionType.DELETE, node: unregisteredNode } as Delete]);
            expect(msgs).toEqual([]);
            expect(deleteSpy).not.toHaveBeenCalled();
        });
    });

    describe("UPDATE", () => {
        it("should replace old content with new content in the FugueTree", () => {
            const textNode = Array.from(ast.nodes.values()).find((n) => n.text.includes("Hello"));
            if (!textNode) throw new Error("Could not find text node in AST");

            ratatoskr.registry.register(textNode.id, { startId: dummyId, length: 13 });

            jest.spyOn(fugue, "getById").mockReturnValue({ id: dummyId, value: "H", isDeleted: false } as any);
            jest.spyOn(fugue, "getVisibleIndex").mockReturnValue(40);
            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            const editScript = [
                {
                    type: ActionType.UPDATE,
                    node: textNode,
                    value: "Goodbye, World!",
                } as Update,
            ];

            const msgs = ratatoskr.translate(editScript);

            expect(deleteSpy).toHaveBeenCalledWith(40, 13);
            expect(insertSpy).toHaveBeenCalledWith(40, "Goodbye, World!");

            const anchor = ratatoskr.registry.get(textNode.id);
            expect(anchor?.length).toBe(15);

            expect(msgs.some((m) => m.coastOpPart === "DELETE")).toBe(true);
            expect(msgs.some((m) => m.coastOpPart === "INSERT")).toBe(true);
        });

        it("should skip UPDATE when new value equals current content", () => {
            const textNode = Array.from(ast.nodes.values()).find((n) => n.text.includes("Hello"))!;
            ratatoskr.registry.register(textNode.id, { startId: dummyId, length: 13 });
            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            const msgs = ratatoskr.translate([
                { type: ActionType.UPDATE, node: textNode, value: "Hello, World!" } as Update,
            ]);

            expect(deleteSpy).not.toHaveBeenCalled();
            expect(insertSpy).not.toHaveBeenCalled();
            expect(msgs).toHaveLength(0);
        });
    });

    describe("MOVE", () => {
        it("should insert at the new position and delete from the old position", () => {
            const textNode = Array.from(ast.nodes.values()).find((n) => n.text.includes("Hello"));
            if (!textNode) throw new Error("Could not find text node in AST");

            ratatoskr.registry.register(textNode.id, { startId: dummyId, length: 13 });

            jest.spyOn(fugue, "getById").mockReturnValue({ id: dummyId, value: "H", isDeleted: false } as any);
            jest.spyOn(fugue, "getVisibleIndex").mockReturnValue(40);
            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            const editScript = [
                {
                    type: ActionType.MOVE,
                    node: textNode,
                    pos: 10,
                } as Move,
            ];

            ratatoskr.translate(editScript);

            expect(insertSpy).toHaveBeenCalledWith(10, "Hello, World!");
            expect(deleteSpy).toHaveBeenCalledWith(40, 13);
        });

        it("should throw when moving an unregistered node", () => {
            const unregisteredNode = { id: "ghost-id", type: "text", text: "x", childrenIds: [] } as any;
            expect(() =>
                ratatoskr.translate([{ type: ActionType.MOVE, node: unregisteredNode, pos: 0 } as Move]),
            ).toThrow("Move target not in registry");
        });

        it("should call insertMultiple before deleteMultiple in MOVE", () => {
            const textNode = Array.from(ast.nodes.values()).find((n) => n.text.includes("Hello"));
            if (!textNode) throw new Error("Could not find text node in AST");

            ratatoskr.registry.register(textNode.id, { startId: dummyId, length: 13 });

            jest.spyOn(fugue, "getById").mockReturnValue({ id: dummyId, value: "H", isDeleted: false } as any);
            jest.spyOn(fugue, "getVisibleIndex").mockReturnValue(40);
            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            const callOrder: string[] = [];
            insertSpy.mockImplementation(function (...args) {
                callOrder.push("insert");
                return originalInsertMultiple.apply(fugue, args);
            });
            deleteSpy.mockImplementation(function (...args) {
                callOrder.push("delete");
                return originalDeleteMultiple.apply(fugue, args);
            });

            const editScript = [
                {
                    type: ActionType.MOVE,
                    node: textNode,
                    pos: 10,
                } as Move,
            ];

            ratatoskr.translate(editScript);

            expect(callOrder).toEqual(["insert", "delete"]);
        });
    });

    describe("Edge Cases", () => {
        it("should tag all messages from one translate() call with the same coastTxId", () => {
            const newNode: AstNode = { id: "n1", type: "text", text: "A", childrenIds: [] } as any;
            const newNode2: AstNode = { id: "n2", type: "text", text: "B", childrenIds: [] } as any;
            const msgs = ratatoskr.translate([
                { type: ActionType.TREE_INSERT, pos: 0, node: newNode } as TreeInsert,
                { type: ActionType.TREE_INSERT, pos: 1, node: newNode2 } as TreeInsert,
            ]);
            const txIds = new Set(msgs.map((m) => m.coastTxId));
            expect(txIds.size).toBe(1);
        });

        it("should log each translate() call to pastActions", () => {
            const newNode: AstNode = { id: "log-node", type: "text", text: "x", childrenIds: [] } as any;
            expect(ratatoskr.pastActions).toHaveLength(0);
            ratatoskr.translate([{ type: ActionType.TREE_INSERT, pos: 0, node: newNode } as TreeInsert]);
            expect(ratatoskr.pastActions).toHaveLength(1);
            expect(ratatoskr.pastActions[0].editScript).toHaveLength(1);
        });

        it("should set coastNodeKey to the node id on all returned messages", () => {
            const newNode: AstNode = { id: "key-check-id", type: "text", text: "X", childrenIds: [] } as any;
            const msgs = ratatoskr.translate([{ type: ActionType.TREE_INSERT, pos: 0, node: newNode } as TreeInsert]);
            msgs.forEach((m) => expect(m.coastNodeKey).toBe("key-check-id"));
        });
    });
});
