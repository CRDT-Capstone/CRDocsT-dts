import type { FNode, ID, FTree } from "../../dts/index.js";

export const ROOT_ID: ID = { sender: "", counter: 0 };

/**
 * Builds a minimal FNode without inserting it into any tree.
 * Useful for constructing expected-value objects in assertions.
 */
export function makeNode(
    sender: string,
    counter: number,
    value: string | null,
    parent: FNode | null,
    side: "L" | "R",
    isDeleted = false,
): FNode {
    return {
        id: { sender, counter },
        value,
        isDeleted,
        parent,
        side,
        leftChildren: [],
        rightChildren: [],
        size: 0,
    };
}

export const ID_A0: ID = { sender: "A", counter: 0 };
export const ID_A1: ID = { sender: "A", counter: 1 };
export const ID_A2: ID = { sender: "A", counter: 2 };
export const ID_B0: ID = { sender: "B", counter: 0 };
export const ID_B1: ID = { sender: "B", counter: 1 };
export const ID_C0: ID = { sender: "C", counter: 0 };

/**
 * Inserts the string "hello" into a fresh FTree one character at a time
 * under the root, right-side, no rightOrigin. Returns the tree and the
 * five inserted nodes in insertion order.
 */
export function buildHelloTree(tree: FTree) {
    const chars = ["h", "e", "l", "l", "o"];
    const ids: ID[] = chars.map((_, i) => ({ sender: "A", counter: i }));
    for (let i = 0; i < chars.length; i++) {
        tree.addNode(ids[i], chars[i], tree.root, "R");
    }
    return ids;
}
