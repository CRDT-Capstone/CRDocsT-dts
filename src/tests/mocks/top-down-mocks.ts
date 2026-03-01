import { BragiAST } from "../../treesitter";

export const IDENTICAL_SRC: BragiAST = {
    rootId: "c9d1e2f3-0001-4000-8000-000000000001",
    nodes: new Map([
        [
            "c9d1e2f3-0001-4000-8000-000000000001",
            {
                id: "c9d1e2f3-0001-4000-8000-000000000001",
                parentId: null,
                type: "source_file",
                text: "Hello world.",
                childrenIds: ["c9d1e2f3-0001-4000-8000-000000000002"],
            },
        ],
        [
            "c9d1e2f3-0001-4000-8000-000000000002",
            {
                id: "c9d1e2f3-0001-4000-8000-000000000002",
                parentId: "c9d1e2f3-0001-4000-8000-000000000001",
                type: "text",
                text: "Hello world.",
                word: [
                    "c9d1e2f3-0001-4000-8000-000000000003",
                    "c9d1e2f3-0001-4000-8000-000000000004",
                ],
                childrenIds: [],
            },
        ],
        [
            "c9d1e2f3-0001-4000-8000-000000000003",
            {
                id: "c9d1e2f3-0001-4000-8000-000000000003",
                parentId: "c9d1e2f3-0001-4000-8000-000000000002",
                type: "word",
                text: "Hello",
                childrenIds: [],
            },
        ],
        [
            "c9d1e2f3-0001-4000-8000-000000000004",
            {
                id: "c9d1e2f3-0001-4000-8000-000000000004",
                parentId: "c9d1e2f3-0001-4000-8000-000000000002",
                type: "word",
                text: "world.",
                childrenIds: [],
            },
        ],
    ]),
};

// ---- DST (structurally identical, different UUIDs) ----
export const IDENTICAL_DST: BragiAST = {
    rootId: "d0e1f2a3-0002-4000-8000-000000000001",
    nodes: new Map([
        [
            "d0e1f2a3-0002-4000-8000-000000000001",
            {
                id: "d0e1f2a3-0002-4000-8000-000000000001",
                parentId: null,
                type: "source_file",
                text: "Hello world.",
                childrenIds: ["d0e1f2a3-0002-4000-8000-000000000002"],
            },
        ],
        [
            "d0e1f2a3-0002-4000-8000-000000000002",
            {
                id: "d0e1f2a3-0002-4000-8000-000000000002",
                parentId: "d0e1f2a3-0002-4000-8000-000000000001",
                type: "text",
                text: "Hello world.",
                word: [
                    "d0e1f2a3-0002-4000-8000-000000000003",
                    "d0e1f2a3-0002-4000-8000-000000000004",
                ],
                childrenIds: [],
            },
        ],
        [
            "d0e1f2a3-0002-4000-8000-000000000003",
            {
                id: "d0e1f2a3-0002-4000-8000-000000000003",
                parentId: "d0e1f2a3-0002-4000-8000-000000000002",
                type: "word",
                text: "Hello",
                childrenIds: [],
            },
        ],
        [
            "d0e1f2a3-0002-4000-8000-000000000004",
            {
                id: "d0e1f2a3-0002-4000-8000-000000000004",
                parentId: "d0e1f2a3-0002-4000-8000-000000000002",
                type: "word",
                text: "world.",
                childrenIds: [],
            },
        ],
    ]),
};

// ---- Expected mappings ----
// Array of [srcId, dstId] pairs that top-down should produce
export const IDENTICAL_EXPECTED_MAPPINGS: [string, string][] = [
    [
        "c9d1e2f3-0001-4000-8000-000000000001", // src source_file
        "d0e1f2a3-0002-4000-8000-000000000001", // dst source_file
    ],
    [
        "c9d1e2f3-0001-4000-8000-000000000002", // src text
        "d0e1f2a3-0002-4000-8000-000000000002", // dst text
    ],
    [
        "c9d1e2f3-0001-4000-8000-000000000003", // src word "Hello"
        "d0e1f2a3-0002-4000-8000-000000000003", // dst word "Hello"
    ],
    [
        "c9d1e2f3-0001-4000-8000-000000000004", // src word "world."
        "d0e1f2a3-0002-4000-8000-000000000004", // dst word "world."
    ],
];


export const WORD_UPDATE_DST: BragiAST = {
    rootId: "e1f2a3b4-0003-4000-8000-000000000001",
    nodes: new Map([
        [
            "e1f2a3b4-0003-4000-8000-000000000001",
            {
                id: "e1f2a3b4-0003-4000-8000-000000000001",
                parentId: null,
                type: "source_file",
                text: "Hello earth.",
                childrenIds: ["e1f2a3b4-0003-4000-8000-000000000002"],
            },
        ],
        [
            "e1f2a3b4-0003-4000-8000-000000000002",
            {
                id: "e1f2a3b4-0003-4000-8000-000000000002",
                parentId: "e1f2a3b4-0003-4000-8000-000000000001",
                type: "text",
                text: "Hello earth.",
                word: [
                    "e1f2a3b4-0003-4000-8000-000000000003",
                    "e1f2a3b4-0003-4000-8000-000000000004",
                ],
                childrenIds: [],
            },
        ],
        [
            "e1f2a3b4-0003-4000-8000-000000000003",
            {
                id: "e1f2a3b4-0003-4000-8000-000000000003",
                parentId: "e1f2a3b4-0003-4000-8000-000000000002",
                type: "word",
                text: "Hello",
                childrenIds: [],
            },
        ],
        [
            "e1f2a3b4-0003-4000-8000-000000000004",
            {
                id: "e1f2a3b4-0003-4000-8000-000000000004",
                parentId: "e1f2a3b4-0003-4000-8000-000000000002",
                type: "word",
                text: "earth.",
                childrenIds: [],
            },
        ],
    ]),
};

export const WORD_UPDATE_EXPECTED_MAPPINGS: [string, string][] = [
    [
        "c9d1e2f3-0001-4000-8000-000000000003", // src word "Hello"
        "e1f2a3b4-0003-4000-8000-000000000003", // dst word "Hello"
    ],
];