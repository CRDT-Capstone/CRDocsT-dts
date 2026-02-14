import { emptyFugueTree } from "./mocks.js";

describe("Fugue Tree Tests", () => {
    describe("Given a Fugue tree ", () => {
        test("Empty Fugue treee has an empty string", () => {
            expect(emptyFugueTree.observe()).toBe("");
        });
    });
});
