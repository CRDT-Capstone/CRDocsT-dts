import { GetNewMappedTree } from "../treesitter/utils";
import { AST, createNewAST } from "./ast-mocks"

describe("To test a bunch of functions that help us with diffing the AST", () => {
    it("Given two ASTs, we created a new Mapped AST with the same keys as the old ASR", () => {
        const oldAST = structuredClone(AST);
        const newAST = createNewAST(AST);



        const oldKeys = Array.from(oldAST.nodes.keys());
        const newASTKeys = Array.from(newAST.nodes.keys());

        expect(oldKeys.length).toEqual(newASTKeys.length);
        expect(oldKeys).not.toEqual(expect.arrayContaining(newASTKeys));

        const newMappedTree = GetNewMappedTree(oldAST, newAST);
        const newMappedKeys = Array.from(newMappedTree.nodes.keys());

        expect(oldKeys.length).toEqual(newMappedKeys.length)
        expect(oldKeys).toEqual(expect.arrayContaining(newMappedKeys));
    });
})