import { AstNode, BragiAST } from "../../../treesitter/index.js";
import { MappingStore } from "../../../treesitter/types/GumTree.js";

export function makeNode(
    id: string,
    type: string,
    text: string,
    parentId: string | null,
    childrenIds: string[] = [],
): AstNode {
    return { id, type, text, parentId, childrenIds } as AstNode;
}

export function makeAst(rootId: string, nodes: AstNode[]): BragiAST {
    const map = new Map<string, AstNode>();
    for (const n of nodes) map.set(n.id, n);
    return { rootId, nodes: map };
}

export function singleNodeTrees(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("old-root", "word", "hello", null);
    const newRoot = makeNode("new-root", "word", "hello", null);

    const oldAst = makeAst("old-root", [oldRoot]);
    const newAst = makeAst("new-root", [newRoot]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("old-root", "new-root");
    return { oldAst, newAst, ms };
}

export function identicalTwoLevelTrees(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    //   root
    //   └─ child
    const oldRoot = makeNode("o-root", "source_file", "doc", null, ["o-child"]);
    const oldChild = makeNode("o-child", "word", "foo", "o-root");

    const newRoot = makeNode("n-root", "source_file", "doc", null, ["n-child"]);
    const newChild = makeNode("n-child", "word", "foo", "n-root");

    const oldAst = makeAst("o-root", [oldRoot, oldChild]);
    const newAst = makeAst("n-root", [newRoot, newChild]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-child", "n-child");
    return { oldAst, newAst, ms };
}

export function updateChildTree(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("o-root", "source_file", "doc", null, ["o-child"]);
    const oldChild = makeNode("o-child", "word", "foo", "o-root");

    const newRoot = makeNode("n-root", "source_file", "doc", null, ["n-child"]);
    const newChild = makeNode("n-child", "word", "bar", "n-root"); // text changed

    const oldAst = makeAst("o-root", [oldRoot, oldChild]);
    const newAst = makeAst("n-root", [newRoot, newChild]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-child", "n-child");
    return { oldAst, newAst, ms };
}

export function insertChildTree(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("o-root", "source_file", "doc", null, ["o-child"]);
    const oldChild = makeNode("o-child", "word", "foo", "o-root");

    const newRoot = makeNode("n-root", "source_file", "doc", null, ["n-child", "n-new"]);
    const newChild = makeNode("n-child", "word", "foo", "n-root");
    const newNew = makeNode("n-new", "word", "new", "n-root"); // inserted

    const oldAst = makeAst("o-root", [oldRoot, oldChild]);
    const newAst = makeAst("n-root", [newRoot, newChild, newNew]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-child", "n-child");
    // n-new is unmapped → Insert action
    return { oldAst, newAst, ms };
}

export function deleteChildTree(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("o-root", "source_file", "doc", null, ["o-keep", "o-del"]);
    const oldKeep = makeNode("o-keep", "word", "keep", "o-root");
    const oldDel = makeNode("o-del", "word", "bye", "o-root"); // will be deleted

    const newRoot = makeNode("n-root", "source_file", "doc", null, ["n-keep"]);
    const newKeep = makeNode("n-keep", "word", "keep", "n-root");

    const oldAst = makeAst("o-root", [oldRoot, oldKeep, oldDel]);
    const newAst = makeAst("n-root", [newRoot, newKeep]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-keep", "n-keep");
    // o-del has no mapping → Delete action
    return { oldAst, newAst, ms };
}

export function moveChildTree(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("o-root", "source_file", "root", null, ["o-A", "o-B"]);
    const oldA = makeNode("o-A", "word", "A", "o-root");
    const oldB = makeNode("o-B", "word", "B", "o-root");

    const newRoot = makeNode("n-root", "source_file", "root", null, ["n-B", "n-A"]);
    const newB = makeNode("n-B", "word", "B", "n-root");
    const newA = makeNode("n-A", "word", "A", "n-root");

    const oldAst = makeAst("o-root", [oldRoot, oldA, oldB]);
    const newAst = makeAst("n-root", [newRoot, newA, newB]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-A", "n-A");
    ms.addMapping("o-B", "n-B");
    return { oldAst, newAst, ms };
}

export function reparentTree(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("o-root", "source_file", "root", null, ["o-p1", "o-p2"]);
    const oldP1 = makeNode("o-p1", "generic_environment", "p1", "o-root", ["o-child"]);
    const oldP2 = makeNode("o-p2", "generic_environment", "p2", "o-root");
    const oldChild = makeNode("o-child", "word", "c", "o-p1");

    const newRoot = makeNode("n-root", "source_file", "root", null, ["n-p1", "n-p2"]);
    const newP1 = makeNode("n-p1", "generic_environment", "p1", "n-root");
    const newP2 = makeNode("n-p2", "generic_environment", "p2", "n-root", ["n-child"]);
    const newChild = makeNode("n-child", "word", "c", "n-p2");

    const oldAst = makeAst("o-root", [oldRoot, oldP1, oldP2, oldChild]);
    const newAst = makeAst("n-root", [newRoot, newP1, newP2, newChild]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-p1", "n-p1");
    ms.addMapping("o-p2", "n-p2");
    ms.addMapping("o-child", "n-child");
    return { oldAst, newAst, ms };
}

export function combinedActionsTree(): { oldAst: BragiAST; newAst: BragiAST; ms: MappingStore } {
    const oldRoot = makeNode("o-root", "source_file", "root", null, ["o-A", "o-B"]);
    const oldA = makeNode("o-A", "word", "foo", "o-root");
    const oldB = makeNode("o-B", "word", "B", "o-root");

    const newRoot = makeNode("n-root", "source_file", "root", null, ["n-A", "n-C"]);
    const newA = makeNode("n-A", "word", "bar", "n-root");
    const newC = makeNode("n-C", "word", "C", "n-root");

    const oldAst = makeAst("o-root", [oldRoot, oldA, oldB]);
    const newAst = makeAst("n-root", [newRoot, newA, newC]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("o-root", "n-root");
    ms.addMapping("o-A", "n-A");
    // o-B unmapped → Delete; n-C unmapped → Insert
    return { oldAst, newAst, ms };
}
