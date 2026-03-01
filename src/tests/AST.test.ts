import { Parser, Tree } from "web-tree-sitter";
import { allChildIds, AstNode, BragiAST, parseCST } from "../treesitter/types/AST";
import { getParser } from "./mocks/BragiAST-mocks.js";
import { breadthFirstAstTraversalFunc, postorderAstTraversalFunc, preoderAstTraversalFunc } from "../treesitter/utils";

describe("AST Codegen and Parsing", () => {
    let parser: Parser;
    let tree: Tree | null = null;

    beforeAll(async () => {
        parser = await getParser();
    });

    afterEach(() => {
        if (tree) {
            tree.delete();
            tree = null;
        }
    });

    afterAll(() => {
        if (parser) {
            parser.delete();
        }
    });

    describe("parseCST", () => {
        it("should parse a simple LaTeX document into a flat node map", () => {
            const code = `
                \\documentclass{article}
                \\begin{document}
                Hello, World!
                \\end{document}
            `;

            tree = parser.parse(code);

            if (!tree || !tree.rootNode) {
                throw new Error("Parser failed to return a valid tree");
            }

            const ast = parseCST(tree.rootNode);

            expect(ast.rootId).toBeDefined();
            expect(ast.nodes.has(ast.rootId)).toBe(true);

            const root = ast.nodes.get(ast.rootId);
            expect(root?.type).toBe("source_file");

            expect(root?.childrenIds.length).toBeGreaterThan(0);
            root?.childrenIds.forEach((id) => {
                expect(ast.nodes.has(id)).toBe(true);
            });
        });

        it("should correctly wire parent-child relationships", () => {
            const code = `\\begin{enumerate} \\item test \\end{enumerate}`;
            tree = parser.parse(code);

            if (!tree?.rootNode) return;

            const ast = parseCST(tree.rootNode);
            const nodes = Array.from(ast.nodes.values());

            const itemNode = nodes.find((n) => n.type === "enum_item");
            const parentNode = nodes.find((n) => n.id === itemNode?.parentId);

            expect(itemNode).toBeDefined();
            expect(parentNode).toBeDefined();
            expect(parentNode?.type).toBe("generic_environment");
        });

        it("should capture text content for leaf nodes", () => {
            const code = `SpecificTextContent`;
            tree = parser.parse(code);

            if (!tree?.rootNode) return;

            const ast = parseCST(tree.rootNode);
            const textNode = Array.from(ast.nodes.values()).find((n) => n.text.includes("SpecificTextContent"));

            expect(textNode).toBeDefined();
        });

        it("should throw an error if no root node is provided", () => {
            expect(() => parseCST(null as any)).toThrow("No root node provided");
        });
    });

    describe("Node Metadata", () => {
        it("should ensure every node in the map has a valid type and text field", () => {
            const code = `\\section{Title}`;
            tree = parser.parse(code);
            if (!tree?.rootNode) return;

            const ast = parseCST(tree.rootNode);

            ast.nodes.forEach((node) => {
                expect(typeof node.type).toBe("string");
                expect(typeof node.text).toBe("string");
                expect(node.id).toBeDefined();
            });
        });
    });

    describe("AST Traversal", () => {
        let ast: BragiAST;

        beforeAll(() => {
            const code = `\\section{A} Text \\textbf{B}`;
            tree = parser.parse(code);
            if (!tree?.rootNode) throw new Error("Parse failed");
            ast = parseCST(tree.rootNode);
        });

        it("should be traversable in Pre-order (Root -> L -> R)", () => {
            const visited: string[] = [];
            preoderAstTraversalFunc(ast, (node) => visited.push(node.type));
            expect(visited[0]).toBe("source_file");
            expect(visited.length).toBe(ast.nodes.size);
        });

        it("should be traversable in Post-order (Left -> Right -> Root)", () => {
            const visited: string[] = [];
            postorderAstTraversalFunc(ast, (node) => visited.push(node.type));
            expect(visited[visited.length - 1]).toBe("source_file");
            expect(visited.length).toBe(ast.nodes.size);
        });

        it("should be traversable in Breadth-First (Level Order)", () => {
            const visited: string[] = [];
            breadthFirstAstTraversalFunc(ast, (node) => visited.push(node.type));
            expect(visited[0]).toBe("source_file");
            expect(visited.length).toBe(ast.nodes.size);
        });
    });
});
