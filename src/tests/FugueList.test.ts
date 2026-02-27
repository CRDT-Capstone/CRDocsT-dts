import { emptyFugueList } from "./mocks/mocks.js";

describe("Fugue List Tests", () => {
    describe("Given a Fugue list ", () => {
        test("Empty Fugue List has an empty string", () => {
            expect(emptyFugueList.observe()).toBe("");
        });
    });
});
