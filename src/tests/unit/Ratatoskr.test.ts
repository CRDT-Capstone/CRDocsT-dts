import { Parser } from "web-tree-sitter";
import { AstNode, BragiAST } from "../../treesitter.js";
import { ActionType, TreeInsert, Delete, Update, Move } from "../../treesitter/Actions/Model/index.js";
import { Ratatoskr } from "../../treesitter/COAST/Ratatoskr/index.js";
import { getParser } from "./mocks/BragiAST-mocks.js";
import { FugueTree, ID } from "../../dts/index.js";
import { bragiAstFromFugueTree, fugueTreeWithContent } from "./mocks/Ratatoskr-mocks.js";
import { describe, expect, it, beforeAll, beforeEach, afterEach, afterAll, jest } from "@jest/globals";

const DOC_CONTENT = `\\documentclass{article}
\\begin{document}
Hello, World!
\\end{document}
`;

describe("Ratatoskr", () => {
    let fugue: FugueTree;
    let ast: BragiAST;
    let ratatoskr: Ratatoskr;
    let parser: Parser;

    let insertSpy: jest.SpiedFunction<FugueTree["insertMultiple"]>;
    let deleteSpy: jest.SpiedFunction<FugueTree["deleteMultiple"]>;

    const originalInsertMultiple = FugueTree.prototype.insertMultiple;
    const originalDeleteMultiple = FugueTree.prototype.deleteMultiple;

    afterAll(() => {
        if (parser) parser.delete();
    });

    beforeAll(async () => {
        parser = await getParser();
    });

    beforeEach(() => {
        fugue = fugueTreeWithContent(DOC_CONTENT);
        ast = bragiAstFromFugueTree(fugue, parser);

        // Stamp the real AST onto the real FugueTree — this makes findAstStart
        // work without any mocking for nodes that exist in the document
        fugue.stampAll(ast);

        ratatoskr = new Ratatoskr(fugue, ast);

        insertSpy = jest.spyOn(fugue, "insertMultiple");
        deleteSpy = jest.spyOn(fugue, "deleteMultiple");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Helper: find a real AST node whose text contains a substring
    const findNode = (substring: string): AstNode => {
        const node = Array.from(ast.nodes.values()).find((n) => n.text?.includes(substring));
        if (!node) throw new Error(`Could not find AST node containing "${substring}"`);
        return node;
    };

    // Helper: find the parent of a node in the AST
    const findParent = (node: AstNode): AstNode => {
        if (!node.parentId) throw new Error(`Node ${node.id} has no parent`);
        const parent = ast.nodes.get(node.parentId);
        if (!parent) throw new Error(`Parent ${node.parentId} not found in AST`);
        return parent;
    };

    describe("TREE_INSERT", () => {
        it("inserts text into the FugueTree at the position resolved from the parent and child ordinal", () => {
            const newNode: AstNode = {
                id: "new-node-id",
                type: "text",
                text: "Brand New Text!",
                childrenIds: [],
                startIndex: 0,
                endIndex: 15,
            } as any;

            // Use the document root as parent so resolveCharPos has a real stamped parent
            const rootNode = ast.nodes.get(ast.rootId)!;

            const editScript: TreeInsert[] = [
                {
                    type: ActionType.TREE_INSERT,
                    pos: 0,
                    node: newNode,
                    parent: rootNode,
                } as any,
            ];

            const msgs = ratatoskr.translate(editScript);

            expect(insertSpy).toHaveBeenCalled();
            expect(msgs[0].coastOpType).toBe("ADD");
            expect(msgs[0].coastNodeKey).toBe("new-node-id");
        });

        it("stamps the inserted FNode so findAstStart returns it after insertion", () => {
            const newNode: AstNode = {
                id: "stamp-check-id",
                type: "text",
                text: "XY",
                childrenIds: [],
                startIndex: 0,
                endIndex: 2,
            } as any;

            const rootNode = ast.nodes.get(ast.rootId)!;

            ratatoskr.translate([
                {
                    type: ActionType.TREE_INSERT,
                    pos: 0,
                    node: newNode,
                    parent: rootNode,
                } as any,
            ]);

            // After insertion the new node should be findable via the real astIdx
            expect(fugue.findASTStart("stamp-check-id")).toBeDefined();
        });
    });

    describe("DELETE", () => {
        it("deletes the correct number of characters using endIndex - startIndex from the AST node", () => {
            const textNode = findNode("Hello");
            const expectedLength = textNode.endIndex - textNode.startIndex;

            // Node is stamped via stampAll in beforeEach — no manual setup needed
            ratatoskr.translate([{ type: ActionType.DELETE, node: textNode } as Delete]);

            expect(deleteSpy).toHaveBeenCalledWith(expect.any(Number), expectedLength);
        });

        it("calls deleteMultiple at the visible index of the stamped FNode", () => {
            const textNode = findNode("Hello");
            const startFNode = fugue.findASTStart(textNode.id)!;
            const expectedIdx = fugue.getVisibleIndex(startFNode);

            ratatoskr.translate([{ type: ActionType.DELETE, node: textNode } as Delete]);

            expect(deleteSpy).toHaveBeenCalledWith(expectedIdx, expect.any(Number));
        });

        it("clears the stamp from astIdx after deletion", () => {
            const textNode = findNode("Hello");
            const clearSpy = jest.spyOn(fugue, "removeASTIdx");

            ratatoskr.translate([{ type: ActionType.DELETE, node: textNode } as Delete]);

            expect(clearSpy).toHaveBeenCalledWith(textNode.id);
        });

        it("returns [] and does not call deleteMultiple when the node is not stamped", () => {
            const unregisteredNode: AstNode = {
                id: "ghost-id",
                type: "text",
                text: "x",
                childrenIds: [],
                startIndex: 0,
                endIndex: 1,
            } as any;

            // ghost-id was never stamped — findAstStart returns undefined naturally
            const msgs = ratatoskr.translate([{ type: ActionType.DELETE, node: unregisteredNode } as Delete]);

            expect(msgs).toEqual([]);
            expect(deleteSpy).not.toHaveBeenCalled();
        });
    });

    describe("UPDATE", () => {
        it("replaces old content with new content and re-stamps the FNode", () => {
            const textNode = findNode("Hello");
            const expectedLength = textNode.endIndex - textNode.startIndex;
            const expectedIdx = fugue.getVisibleIndex(fugue.findASTStart(textNode.id)!);

            // Mock getSpanText so the "same value" guard doesn't skip the operation
            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");
            const updateASTIdxSpy = jest.spyOn(fugue, "updateASTIdx");

            const msgs = ratatoskr.translate([
                {
                    type: ActionType.UPDATE,
                    node: textNode,
                    value: "Goodbye, World!",
                    newNode: textNode,
                } as Update,
            ]);

            expect(deleteSpy).toHaveBeenCalledWith(expectedIdx, expectedLength);
            expect(insertSpy).toHaveBeenCalledWith(expectedIdx, "Goodbye, World!");
            expect(updateASTIdxSpy).toHaveBeenCalledWith(textNode.id, expect.any(Object));
            expect(msgs.some((m) => m.coastOpPart === "DELETE")).toBe(true);
            expect(msgs.some((m) => m.coastOpPart === "INSERT")).toBe(true);
        });

        it("skips UPDATE when the new value equals the current span content", () => {
            const textNode = findNode("Hello");

            // Return the exact same value as what we pass to UPDATE
            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            const msgs = ratatoskr.translate([
                {
                    type: ActionType.UPDATE,
                    node: textNode,
                    value: "Hello, World!",
                    newNode: textNode,
                } as Update,
            ]);

            expect(deleteSpy).not.toHaveBeenCalled();
            expect(insertSpy).not.toHaveBeenCalled();
            expect(msgs).toHaveLength(0);
        });

        it("also stamps newNode.id when it differs from the original node id", () => {
            const textNode = findNode("Hello");
            const newNode = { ...textNode, id: "updated-node-id" };

            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");
            const updateASTIdxSpy = jest.spyOn(fugue, "updateASTIdx");

            ratatoskr.translate([
                {
                    type: ActionType.UPDATE,
                    node: textNode,
                    value: "New Text",
                    newNode,
                } as Update,
            ]);

            expect(updateASTIdxSpy).toHaveBeenCalledWith("updated-node-id", expect.any(Object));
        });
    });

    describe("MOVE", () => {
        it("inserts content at the destination before deleting from the source", () => {
            const textNode = findNode("Hello");
            const parent = findParent(textNode);

            // Spy so we can verify insert happens before delete
            const callOrder: string[] = [];
            insertSpy.mockImplementation(function (...args) {
                callOrder.push("insert");
                return originalInsertMultiple.apply(fugue, args);
            });
            deleteSpy.mockImplementation(function (...args) {
                callOrder.push("delete");
                return originalDeleteMultiple.apply(fugue, args);
            });

            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            ratatoskr.translate([
                {
                    type: ActionType.MOVE,
                    node: textNode,
                    parent,
                    pos: 0,
                } as any,
            ]);

            expect(callOrder).toEqual(["insert", "delete"]);
        });

        it("deletes the correct number of characters using endIndex - startIndex", () => {
            const textNode = findNode("Hello");
            const parent = findParent(textNode);
            const expectedLength = textNode.endIndex - textNode.startIndex;

            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            ratatoskr.translate([
                {
                    type: ActionType.MOVE,
                    node: textNode,
                    parent,
                    pos: 0,
                } as any,
            ]);

            expect(deleteSpy).toHaveBeenCalledWith(expect.any(Number), expectedLength);
        });

        it("re-stamps the node with the first inserted FNode after a move", () => {
            const textNode = findNode("Hello");
            const parent = findParent(textNode);
            const updateASTIdxSpy = jest.spyOn(fugue, "updateASTIdx");

            jest.spyOn(ratatoskr as any, "getSpanText").mockReturnValue("Hello, World!");

            ratatoskr.translate([
                {
                    type: ActionType.MOVE,
                    node: textNode,
                    parent,
                    pos: 0,
                } as any,
            ]);

            expect(updateASTIdxSpy).toHaveBeenCalledWith(textNode.id, expect.any(Object));
        });

        it("throws when moving a node that is not stamped in astIdx", () => {
            const unregisteredNode: AstNode = {
                id: "ghost-id",
                type: "text",
                text: "x",
                childrenIds: [],
                startIndex: 0,
                endIndex: 1,
            } as any;

            const rootNode = ast.nodes.get(ast.rootId)!;

            expect(() =>
                ratatoskr.translate([
                    {
                        type: ActionType.MOVE,
                        node: unregisteredNode,
                        parent: rootNode,
                        pos: 0,
                    } as any,
                ]),
            ).toThrow("Move target not stamped");
        });
    });

    describe("Edge Cases", () => {
        it("tags all messages from one translate() call with the same coastTxId", () => {
            const rootNode = ast.nodes.get(ast.rootId)!;
            const makeLeaf = (id: string, text: string): AstNode =>
                ({ id, type: "text", text, childrenIds: [], startIndex: 0, endIndex: text.length }) as any;

            const msgs = ratatoskr.translate([
                { type: ActionType.TREE_INSERT, pos: 0, node: makeLeaf("n1", "A"), parent: rootNode } as any,
                { type: ActionType.TREE_INSERT, pos: 0, node: makeLeaf("n2", "B"), parent: rootNode } as any,
            ]);

            const txIds = new Set(msgs.map((m) => m.coastTxId));
            expect(txIds.size).toBe(1);
        });

        it("logs each translate() call to pastActions", () => {
            const rootNode = ast.nodes.get(ast.rootId)!;
            const newNode: AstNode = {
                id: "log-node",
                type: "text",
                text: "x",
                childrenIds: [],
                startIndex: 0,
                endIndex: 1,
            } as any;

            expect(ratatoskr.pastActions).toHaveLength(0);
            ratatoskr.translate([{ type: ActionType.TREE_INSERT, pos: 0, node: newNode, parent: rootNode } as any]);
            expect(ratatoskr.pastActions).toHaveLength(1);
            expect(ratatoskr.pastActions[0].editScript).toHaveLength(1);
        });

        it("sets coastNodeKey to the node id on all returned messages", () => {
            const rootNode = ast.nodes.get(ast.rootId)!;
            const newNode: AstNode = {
                id: "key-check-id",
                type: "text",
                text: "X",
                childrenIds: [],
                startIndex: 0,
                endIndex: 1,
            } as any;

            const msgs = ratatoskr.translate([
                { type: ActionType.TREE_INSERT, pos: 0, node: newNode, parent: rootNode } as any,
            ]);

            msgs.forEach((m) => expect(m.coastNodeKey).toBe("key-check-id"));
        });

        it("returns an empty array when translate is called with an empty edit script", () => {
            const msgs = ratatoskr.translate([]);
            expect(msgs).toEqual([]);
        });

        it("returns [] without calling newAst when newAst is not set", () => {
            const bare = new Ratatoskr(fugue);
            const msgs = bare.translate([{ type: ActionType.DELETE, node: findNode("Hello") } as Delete]);
            expect(msgs).toEqual([]);
            expect(deleteSpy).not.toHaveBeenCalled();
        });
    });
});
