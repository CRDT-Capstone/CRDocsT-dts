import { GetNewMappedTree } from "../treesitter/utils";
import { AST, createNewAST } from "./ast-mocks"

describe("To test a bunch of functions that help us with diffing the AST", ()=>{
    it("Given two ASTs, we created a new Mapped AST with the same keys as the old ASR", ()=>{
        const oldAST = structuredClone(AST);
        const newAST = createNewAST(AST);

        const newMappedTree = GetNewMappedTree(oldAST, newAST);

        const oldKeys = Array.from(oldAST.nodes.keys());
        const newMappedKeys = Array.from(newMappedTree.nodes.keys());
        
        expect(oldKeys.length).toEqual(newMappedKeys.length)
        expect(oldKeys).toEqual(expect.arrayContaining(newMappedKeys));
    });
})