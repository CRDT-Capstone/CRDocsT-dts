import crypto from "node:crypto";
import { FugueTree } from "../../dts/index.js";
import { Parser } from "web-tree-sitter";
import { parseCST } from "../../treesitter.js";

export const emptyFugueTree = () => new FugueTree(null, crypto.randomBytes(24).toString("hex"), "test-tree");

export const fugueTreeWithContent = (content: string) => {
    const tree = new FugueTree(null, crypto.randomBytes(24).toString("hex"), "test-tree");
    tree.insertMultiple(0, content);
    return tree;
};

export const bragiAstFromFugueTree = (fugue: FugueTree, parser: Parser) => {
    const content = fugue.observe();
    const tree = parser.parse(content)!;
    const ast = parseCST(tree.rootNode!);
    return ast;
};
