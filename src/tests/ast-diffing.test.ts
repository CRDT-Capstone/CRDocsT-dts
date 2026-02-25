import { GetNewMappedTree } from "../treesitter/utils";
import { AST, createNewAST, doDeletion, doInsertion, MORE_COMPLEX_AST } from "./ast-mocks"

describe("To test a bunch of functions that help us with diffing the AST", () => {
    it.each([
        AST,
        MORE_COMPLEX_AST
    ])("Given the old and new ASTs with different ids but same nodes, we should get a new mapped tree with the same keys as the old", (ast) => {
        const oldAST = structuredClone(ast);
        const newAST = createNewAST(ast);

        const oldKeys = Array.from(oldAST.nodes.keys());
        const newASTKeys = Array.from(newAST.nodes.keys());

        //Ensure that the keys are different!
        expect(oldKeys.length).toEqual(newASTKeys.length);
        expect(oldKeys).not.toEqual(expect.arrayContaining(newASTKeys));

        const newMappedTree = GetNewMappedTree(oldAST, newAST);
        const newMappedKeys = Array.from(newMappedTree.nodes.keys());

        expect(oldKeys.length).toEqual(newMappedKeys.length)
        expect(oldKeys).toEqual(expect.arrayContaining(newMappedKeys));
    });

    it.each([
        [AST, 1],
        [MORE_COMPLEX_AST, 1],
        [MORE_COMPLEX_AST, 2],
    ])("Given the old AST, we create a new AST with a deletion. And we should end up with a new mapped tree having the same keys", (ast, index) => {
        const oldAST = structuredClone(ast);
        const newASTWithDeletion = doDeletion(oldAST, index);
        const newAST = createNewAST(newASTWithDeletion);

        const oldKeys = Array.from(oldAST.nodes.keys());
        const newASTKeys = Array.from(newAST.nodes.keys());

        expect(oldKeys.length).toBeGreaterThan(newASTKeys.length);
        expect(oldKeys).not.toEqual(expect.arrayContaining(newASTKeys));

        const newMappedTree = GetNewMappedTree(oldAST, newAST);
        const newMappedKeys = Array.from(newMappedTree.nodes.keys());

        expect(oldKeys.length).toBeGreaterThan(newMappedKeys.length);
        expect(oldKeys).toEqual(expect.arrayContaining(newMappedKeys));
    });

    it.each([
        [AST, 0],
        [AST, 1],
        // [MORE_COMPLEX_AST, 0],
        // [MORE_COMPLEX_AST, 1],
        // [MORE_COMPLEX_AST, 2],
    ])("Given the old AST, we create a new AST with an insertion. And we should end up with a new mapped tree having the same keys, plus a new key", (ast, index) => {
        const oldAST = structuredClone(ast);
        const newASTWithInsertion = doInsertion(oldAST, index);
        const newAST = createNewAST(newASTWithInsertion);

        const oldKeys = Array.from(oldAST.nodes.keys());
        const newASTKeys = Array.from(newAST.nodes.keys());

        expect(oldKeys.length).toBeLessThan(newASTKeys.length);
        expect(oldKeys).not.toEqual(expect.arrayContaining(newASTKeys));

        const newMappedTree = GetNewMappedTree(oldAST, newAST);
        const newMappedKeys = Array.from(newMappedTree.nodes.keys());

        expect(oldKeys.length).toBeLessThan(newMappedKeys.length);
        expect(oldKeys.length).toEqual(newMappedKeys.length - 1);
        expect(oldKeys).toEqual(expect.arrayContaining(newMappedKeys.slice(0, newMappedKeys.length - 1)));
    });


})