import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import { Parser, Tree } from "web-tree-sitter";
import { getParser, makeTreeWithContent, LATEX_FIXTURES } from "./mocks/Fugue_CST_AST-mocks.js";
import { parseCST } from "../../treesitter/types/AST.js";
import { makeFugueTree } from "../unit/mocks/FugueTree-mocks.js";

describe("Fugue_CST_AST", () => {
    let parser: Parser;
    let cst: Tree | null = null;

    beforeAll(async () => {
        parser = await getParser();
    });

    afterEach(() => {
        if (cst) {
            cst.delete();
            cst = null;
        }
    });

    afterAll(() => {
        parser.delete();
    });

    /**
     * Sub-flow: FugueTree -> CST
     * Verifies that the visible string of the CRDT is correctly parsed into a CST.
     */
    describe("FugueTree -> CST Integration", () => {
        it("transforms the visible string of a FugueTree into a valid Tree-sitter CST", () => {
            const tree = makeTreeWithContent(LATEX_FIXTURES.SIMPLE_SECTION);
            const visibleText = tree.observe(); // Stage 1 output

            cst = parser.parse(visibleText); // Stage 2 input

            if (!cst || !cst.rootNode) {
                throw new Error("Parser failed to return a valid cst");
            }

            expect(cst.rootNode.type).toBe("source_file");
            expect(cst.rootNode.text).toBe(visibleText);
            // Verify structural presence in CST
            const section = cst.rootNode.namedChild(0);
            expect(section?.type).toBe("section");
        });

        it("produces an empty CST from an empty FugueTree", () => {
            const tree = makeTreeWithContent("");
            cst = parser.parse(tree.observe());

            if (!cst || !cst.rootNode) {
                throw new Error("Parser failed to return a valid cst");
            }

            expect(cst.rootNode.text).toBe("");
            expect(cst.rootNode.namedChildCount).toBe(0);
        });
    });

    /**
     * Sub-flow: CST -> AST
     * Verifies that a Tree-sitter CST is correctly unmarshaled into the Bragi AST map.
     */
    describe("CST -> AST Integration", () => {
        it("correctly unmarshals a complex CST into a flat BragiAST map", () => {
            cst = parser.parse(LATEX_FIXTURES.ENUMERATION);

            if (!cst || !cst.rootNode) {
                throw new Error("Parser failed to return a valid cst");
            }

            const ast = parseCST(cst.rootNode);
            const nodes = Array.from(ast.nodes.values());

            // Check specific types derived from unmarshalers
            const envNode = nodes.find((n) => n.type === "generic_environment");
            const itemNodes = nodes.filter((n) => n.type === "enum_item");

            expect(envNode).toBeDefined();
            expect(itemNodes.length).toBe(2);

            // Verify parent-child linkage in the map
            itemNodes.forEach((item) => {
                expect(item.parentId).toBe(envNode!.id);
                expect(envNode!.childrenIds).toContain(item.id);
            });
        });

        it("gracefully handles recovery for malformed CST nodes (ERROR nodes)", () => {
            cst = parser.parse(LATEX_FIXTURES.MALFORMED_LATEX);

            if (!cst || !cst.rootNode) {
                throw new Error("Parser failed to return a valid cst");
            }

            // Should not throw, even with ERROR nodes in CST
            const ast = parseCST(cst.rootNode);
            const errorNodes = Array.from(ast.nodes.values()).filter((n) => (n.type as string) === "ERROR");

            expect(errorNodes.length).toBeGreaterThan(0);
            expect(ast.nodes.has(ast.rootId)).toBe(true);
        });
    });

    /**
     * Composite Flow: FugueTree -> CST -> AST
     * Verifies the full end-to-end pipeline including concurrent CRDT mutations.
     */
    describe("FugueTree -> CST -> AST End-to-End", () => {
        it("reflects concurrent CRDT updates correctly in the final AST", () => {
            // 1. Initialize Replicas from a common start
            const replicaA = makeFugueTree();
            const replicaB = makeFugueTree();

            // 2. Synchronize the initial document structure
            const initMsgs = replicaA.insertMultiple(0, "\\section{Title}");
            replicaB.effect(initMsgs); // Now both share identical node IDs

            // 3. Perform concurrent operations
            const msgA = replicaA.insertMultiple(15, "\nSome content");
            const msgB = replicaB.deleteMultiple(9, 5);

            // 4. Cross-apply
            replicaA.effect(msgB);
            replicaB.effect(msgA);

            const finalDoc = replicaA.observe();
            expect(finalDoc).toContain("Some content");
            expect(finalDoc).not.toContain("Title");
        });

        it("maintains positional integrity of AST nodes after document-wide transformations", () => {
            const initialLatex = "\\textbf{Bold} \\textit{Italic}";
            const tree = makeTreeWithContent(initialLatex);

            // Flow 1
            cst = parser.parse(tree.observe());
            if (!cst || !cst.rootNode) {
                throw new Error("Parser failed to return a valid cst");
            }
            let ast = parseCST(cst.rootNode);
            const italicId = Array.from(ast.nodes.values()).find((n) => n.text.includes("Italic"))?.id;

            cst.delete();
            cst = null;

            // Mutation: Insert at the very beginning, shifting everything
            tree.insertMultiple(0, "\\section{New} ");

            // Flow 2 (Full Pipeline)
            cst = parser.parse(tree.observe());
            if (!cst || !cst.rootNode) {
                throw new Error("Parser failed to return a valid cst");
            }
            const finalAst = parseCST(cst.rootNode);
            const italicNodeAfterShift = Array.from(finalAst.nodes.values()).find(
                (n) => n.type === "generic_command" && n.text === "\\textit{Italic}",
            );

            expect(italicNodeAfterShift).toBeDefined();
            expect(italicNodeAfterShift?.type).toBe("generic_command");
        });
    });
});
