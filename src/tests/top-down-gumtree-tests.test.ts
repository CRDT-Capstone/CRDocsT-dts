import { v4 } from "uuid";
import { GumTreeTopDown } from "../treesitter/GumTreeTopDown";
import { createNewAST, doInsertion } from "./mocks/ast-mocks";
import { IDENTICAL_DST, IDENTICAL_EXPECTED_MAPPINGS, IDENTICAL_SRC } from "./mocks/top-down-mocks";

describe("TopDown - identical trees", () => {
    let mappings: [string, string][];

    beforeEach(() => {
        const topDown = new GumTreeTopDown(IDENTICAL_SRC, IDENTICAL_DST);
        mappings = topDown.topDown()
    });

    it("should return the correct number of mappings", () => {
        expect(mappings.length).toEqual(IDENTICAL_EXPECTED_MAPPINGS.length);
    });

    it("should match the expected mappings", () => {
        expect(mappings).toEqual(expect.arrayContaining(IDENTICAL_EXPECTED_MAPPINGS));
    });
});

describe("TopDown - node and word inserts", () => {
    it("should return the correct matching for a node insert", () => {
        const oldTree = structuredClone(IDENTICAL_SRC);

        const id = v4();
        const newTreeWithInsertion = doInsertion(oldTree, 1, id);

        const topDown = new GumTreeTopDown(oldTree, newTreeWithInsertion);

        const expectedMapping = [
            [
                "c9d1e2f3-0001-4000-8000-000000000003",
                "c9d1e2f3-0001-4000-8000-000000000003",
            ],
            [
                "c9d1e2f3-0001-4000-8000-000000000004",
                "c9d1e2f3-0001-4000-8000-000000000004",
            ]
        ];

        const mapping = topDown.topDown();
        expect(mapping.length).toEqual(2);
        expect(mapping).toEqual(expect.arrayContaining(expectedMapping));
    })
});