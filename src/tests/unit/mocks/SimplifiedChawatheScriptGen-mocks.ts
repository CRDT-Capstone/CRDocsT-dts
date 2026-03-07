import { AstNode, BragiAST, NodeId } from "../../../treesitter/types/AST.js";
import { Delete, Insert, Move, TreeDelete, TreeInsert, Update } from "../../../treesitter/Actions/Model/index.js";
import { makeAst } from "./ChawatheScriptGen-mocks.js";
import { MappingStore } from "../../../treesitter/types/GumTree.js";

export function makeNode(
    id: NodeId,
    parentId: NodeId | null,
    childrenIds: NodeId[],
    type = "word",
    text = id,
): AstNode {
    return { id, parentId, type, text, childrenIds } as unknown as AstNode;
}

export function makeIdenticalSingleNodeScenario() {
    const srcNode = makeNode("root", null, []);
    const dstNode = makeNode("root", null, []);
    const oldAst = makeAst("root", [srcNode]);
    const newAst = makeAst("root", [dstNode]);
    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    return { ms, oldAst, newAst };
}

export function makeSingleInsertScenario() {
    //  old:  root
    //  new:  root
    //           └─ child
    const srcRoot = makeNode("root", null, []);
    const dstRoot = makeNode("root", null, ["child"]);
    const dstChild = makeNode("child", "root", []);

    const oldAst = makeAst("root", [srcRoot]);
    const newAst = makeAst("root", [dstRoot, dstChild]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    // "child" is unmapped → Insert action expected
    return { ms, oldAst, newAst };
}

export function makeSingleDeleteScenario() {
    //  old:  root
    //           └─ child
    //  new:  root
    const srcRoot = makeNode("root", null, ["child"]);
    const srcChild = makeNode("child", "root", []);
    const dstRoot = makeNode("root", null, []);

    const oldAst = makeAst("root", [srcRoot, srcChild]);
    const newAst = makeAst("root", [dstRoot]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    // "child" unmapped → Delete action expected
    return { ms, oldAst, newAst };
}

export function makeSubtreeInsertScenario() {
    //  old:  root
    //  new:  root
    //           └─ parent
    //                ├─ c1
    //                └─ c2
    const srcRoot = makeNode("root", null, []);
    const dstRoot = makeNode("root", null, ["parent"]);
    const dstParent = makeNode("parent", "root", ["c1", "c2"]);
    const dstC1 = makeNode("c1", "parent", []);
    const dstC2 = makeNode("c2", "parent", []);

    const oldAst = makeAst("root", [srcRoot]);
    const newAst = makeAst("root", [dstRoot, dstParent, dstC1, dstC2]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    return { ms, oldAst, newAst };
}

export function makeSubtreeDeleteScenario() {
    //  old:  root
    //           └─ parent
    //                ├─ c1
    //                └─ c2
    //  new:  root
    const srcRoot = makeNode("root", null, ["parent"]);
    const srcParent = makeNode("parent", "root", ["c1", "c2"]);
    const srcC1 = makeNode("c1", "parent", []);
    const srcC2 = makeNode("c2", "parent", []);
    const dstRoot = makeNode("root", null, []);

    const oldAst = makeAst("root", [srcRoot, srcParent, srcC1, srcC2]);
    const newAst = makeAst("root", [dstRoot]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    return { ms, oldAst, newAst };
}

export function makePartialSubtreeInsertScenario() {
    //  old:  root
    //           └─ existing
    //  new:  root
    //           └─ parent
    //                ├─ existing   (mapped)
    //                └─ newChild   (unmapped)
    const srcRoot = makeNode("root", null, ["existing"]);
    const srcExisting = makeNode("existing", "root", []);
    const dstRoot = makeNode("root", null, ["parent"]);
    const dstParent = makeNode("parent", "root", ["existing", "newChild"]);
    const dstExisting = makeNode("existing", "parent", []);
    const dstNewChild = makeNode("newChild", "parent", []);

    const oldAst = makeAst("root", [srcRoot, srcExisting]);
    const newAst = makeAst("root", [dstRoot, dstParent, dstExisting, dstNewChild]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    ms.addMapping("existing", "existing");
    return { ms, oldAst, newAst };
}

export function makePartialSubtreeDeleteScenario() {
    //  old:  root
    //           └─ parent
    //                ├─ surviving  (mapped)
    //                └─ dying      (unmapped)
    //  new:  root
    //           └─ surviving
    const srcRoot = makeNode("root", null, ["parent"]);
    const srcParent = makeNode("parent", "root", ["surviving", "dying"]);
    const srcSurviving = makeNode("surviving", "parent", []);
    const srcDying = makeNode("dying", "parent", []);
    const dstRoot = makeNode("root", null, ["surviving"]);
    const dstSurviving = makeNode("surviving", "root", []);

    const oldAst = makeAst("root", [srcRoot, srcParent, srcSurviving, srcDying]);
    const newAst = makeAst("root", [dstRoot, dstSurviving]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    ms.addMapping("surviving", "surviving");
    return { ms, oldAst, newAst };
}

export function makeMoveAndUpdateScenario() {
    //  old:  root
    //           ├─ a
    //           └─ b
    //  new:  root
    //           ├─ b  (moved)
    //           └─ a  (text changed)
    const srcRoot = makeNode("root", null, ["a", "b"]);
    const srcA = makeNode("a", "root", [], "word", "alpha");
    const srcB = makeNode("b", "root", []);
    const dstRoot = makeNode("root", null, ["b", "a"]);
    const dstA = makeNode("a", "root", [], "word", "ALPHA"); // text changed
    const dstB = makeNode("b", "root", []);

    const oldAst = makeAst("root", [srcRoot, srcA, srcB]);
    const newAst = makeAst("root", [dstRoot, dstA, dstB]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    ms.addMapping("a", "a");
    ms.addMapping("b", "b");
    return { ms, oldAst, newAst };
}

export function makeDeepSubtreeInsertScenario() {
    //  old:  root
    //  new:  root
    //           └─ l1
    //                └─ l2
    //                     └─ l3
    const srcRoot = makeNode("root", null, []);
    const dstRoot = makeNode("root", null, ["l1"]);
    const dstL1 = makeNode("l1", "root", ["l2"]);
    const dstL2 = makeNode("l2", "l1", ["l3"]);
    const dstL3 = makeNode("l3", "l2", []);

    const oldAst = makeAst("root", [srcRoot]);
    const newAst = makeAst("root", [dstRoot, dstL1, dstL2, dstL3]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    return { ms, oldAst, newAst };
}

export function makeDeepSubtreeDeleteScenario() {
    const srcRoot = makeNode("root", null, ["l1"]);
    const srcL1 = makeNode("l1", "root", ["l2"]);
    const srcL2 = makeNode("l2", "l1", ["l3"]);
    const srcL3 = makeNode("l3", "l2", []);
    const dstRoot = makeNode("root", null, []);

    const oldAst = makeAst("root", [srcRoot, srcL1, srcL2, srcL3]);
    const newAst = makeAst("root", [dstRoot]);

    const ms = new MappingStore(oldAst, newAst);
    ms.addMapping("root", "root");
    return { ms, oldAst, newAst };
}

export function makeStubChawathe(actions: ReturnType<typeof buildActions>) {
    return { computeActions: jest.fn().mockReturnValue(actions) };
}

type BuildActionsInput = Array<
    | { kind: "insert"; node: AstNode; parent: AstNode; pos: number }
    | { kind: "delete"; node: AstNode }
    | { kind: "move"; node: AstNode; parent: AstNode; pos: number }
    | { kind: "update"; node: AstNode; value: string; newNode: AstNode }
    | { kind: "treeInsert"; node: AstNode; parent: AstNode; pos: number }
    | { kind: "treeDelete"; node: AstNode }
>;

export function buildActions(specs: BuildActionsInput) {
    return specs.map((s) => {
        switch (s.kind) {
            case "insert":
                return new Insert(s.node, s.parent, s.pos);
            case "delete":
                return new Delete(s.node);
            case "move":
                return new Move(s.node, s.parent, s.pos);
            case "update":
                return new Update(s.node, s.value, s.newNode);
            case "treeInsert":
                return new TreeInsert(s.node, s.parent, s.pos);
            case "treeDelete":
                return new TreeDelete(s.node);
        }
    });
}
