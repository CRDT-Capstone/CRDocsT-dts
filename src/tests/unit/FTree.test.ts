import { describe, it, expect, beforeEach } from "@jest/globals";
import { FTree } from "../../dts/index.js";
import { ID_A0, ID_A1, ID_A2, ID_B0, ID_B1, ID_C0, buildHelloTree } from "./mocks/FTree-mocks.js";

// ---------------------------------------------------------------------------
// Constructor
// ---------------------------------------------------------------------------

describe("FTree constructor", () => {
    it("initialises a root node that is marked deleted with a null parent", () => {
        const tree = new FTree();
        expect(tree.root.isDeleted).toBe(true);
        expect(tree.root.parent).toBeNull();
    });

    it("initialises root with size 0 and empty children arrays", () => {
        const tree = new FTree();
        expect(tree.root.size).toBe(0);
        expect(tree.root.leftChildren).toHaveLength(0);
        expect(tree.root.rightChildren).toHaveLength(0);
    });

    it("initialises root with the sentinel id { sender: '', counter: 0 }", () => {
        const tree = new FTree();
        expect(tree.root.id).toEqual({ sender: "", counter: 0 });
    });

    it("registers the root in the node map under the empty-string sender", () => {
        const tree = new FTree();
        const nodes = tree.getNodes();
        expect(nodes.get("")?.[0]).toBe(tree.root);
    });
});

// ---------------------------------------------------------------------------
// getByID
// ---------------------------------------------------------------------------

describe("FTree.getByID", () => {
    let tree: FTree;
    beforeEach(() => {
        tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
    });

    it("returns the root node when looked up by its sentinel id", () => {
        expect(tree.getByID({ sender: "", counter: 0 })).toBe(tree.root);
    });

    it("returns the correct node for a known id", () => {
        const node = tree.getByID(ID_A0);
        expect(node.value).toBe("a");
        expect(node.id).toEqual(ID_A0);
    });

    it("throws for an unknown sender", () => {
        expect(() => tree.getByID({ sender: "UNKNOWN", counter: 0 })).toThrow(/Unknown ID/);
    });

    it("throws when the counter is out of range for a known sender", () => {
        expect(() => tree.getByID({ sender: "A", counter: 99 })).toThrow(/Unknown ID/);
    });
});

// ---------------------------------------------------------------------------
// addNode
// ---------------------------------------------------------------------------

describe("FTree.addNode", () => {
    let tree: FTree;
    beforeEach(() => {
        tree = new FTree();
    });

    it("adds the node to the tree so that it is retrievable by id", () => {
        tree.addNode(ID_A0, "x", tree.root, "R");
        expect(tree.getByID(ID_A0).value).toBe("x");
    });

    it("increments root size by 1 after a single insertion", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        expect(tree.root.size).toBe(1);
    });

    it("increments root size cumulatively for multiple insertions", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        tree.addNode(ID_A1, "b", tree.root, "R");
        expect(tree.root.size).toBe(2);
    });

    it("places a right-side node in the parent's rightChildren array", () => {
        tree.addNode(ID_A0, "r", tree.root, "R");
        expect(tree.root.rightChildren).toHaveLength(1);
        expect(tree.root.rightChildren[0]).toBe(tree.getByID(ID_A0));
    });

    it("places a left-side node in the parent's leftChildren array", () => {
        tree.addNode(ID_A0, "l", tree.root, "L");
        expect(tree.root.leftChildren).toHaveLength(1);
        expect(tree.root.leftChildren[0]).toBe(tree.getByID(ID_A0));
    });

    it("sets rightOrigin to null when rightOriginID is null", () => {
        tree.addNode(ID_A0, "a", tree.root, "R", null);
        expect(tree.getByID(ID_A0).rightOrigin).toBeNull();
    });

    it("sets rightOrigin to undefined when rightOriginID argument is omitted", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        expect(tree.getByID(ID_A0).rightOrigin).toBeUndefined();
    });

    it("resolves rightOriginID to the correct FNode pointer", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        tree.addNode(ID_A1, "b", tree.root, "R", ID_A0);
        const nodeA1 = tree.getByID(ID_A1);
        expect(nodeA1.rightOrigin).toBe(tree.getByID(ID_A0));
    });

    it("throws when rightOriginID refers to a node not yet in the tree", () => {
        expect(() => tree.addNode(ID_A0, "a", tree.root, "R", { sender: "GHOST", counter: 0 })).toThrow(/Unknown ID/);
    });

    it("accumulates nodes for the same sender under their counter index", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        tree.addNode(ID_A1, "b", tree.root, "R");
        expect(tree.getNodes().get("A")).toHaveLength(2);
    });

    it("creates a separate sender entry for each distinct sender", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        tree.addNode(ID_B0, "b", tree.root, "R");
        expect(tree.getNodes().has("A")).toBe(true);
        expect(tree.getNodes().has("B")).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// Sibling ordering — right children
// ---------------------------------------------------------------------------

describe("right-children sibling ordering", () => {
    let tree: FTree;
    beforeEach(() => {
        tree = new FTree();
    });

    it("nodes with no rightOrigin are ordered by ascending sender id", () => {
        // Sender "B" inserts first, then "A". With null rightOrigin, lexicographic
        // order governs: "A" < "B", so A should appear before B in rightChildren.
        tree.addNode(ID_B0, "b", tree.root, "R", null);
        tree.addNode(ID_A0, "a", tree.root, "R", null);
        const right = tree.root.rightChildren;
        expect(right[0]).toBe(tree.getByID(ID_A0));
        expect(right[1]).toBe(tree.getByID(ID_B0));
    });

    it("a node with a lesser rightOrigin is placed before one with a greater rightOrigin", () => {
        tree.addNode(ID_A0, "a", tree.root, "R", null);
        tree.addNode(ID_A1, "b", tree.root, "R", null);
        // B0 references A0 as rightOrigin (A0 < A1), so B0 should precede B1.
        tree.addNode(ID_B0, "x", tree.root, "R", ID_A0);
        tree.addNode(ID_B1, "y", tree.root, "R", ID_A1);
        const right = tree.root.rightChildren;
        expect(right.indexOf(tree.getByID(ID_B0))).toBeLessThan(right.indexOf(tree.getByID(ID_B1)));
    });
});

// ---------------------------------------------------------------------------
// Sibling ordering — left children
// ---------------------------------------------------------------------------

describe("left-children sibling ordering", () => {
    it("left children are sorted by ascending sender id regardless of insertion order", () => {
        const tree = new FTree();
        tree.addNode(ID_C0, "c", tree.root, "L");
        tree.addNode(ID_A0, "a", tree.root, "L");
        tree.addNode(ID_B0, "b", tree.root, "L");
        const left = tree.root.leftChildren;
        expect(left[0]).toBe(tree.getByID(ID_A0));
        expect(left[1]).toBe(tree.getByID(ID_B0));
        expect(left[2]).toBe(tree.getByID(ID_C0));
    });
});

// ---------------------------------------------------------------------------
// depth
// ---------------------------------------------------------------------------

describe("FTree.depth", () => {
    let tree: FTree;
    beforeEach(() => {
        tree = new FTree();
    });

    it("returns 0 for the root", () => {
        expect(tree.depth(tree.root)).toBe(0);
    });

    it("returns 1 for a direct child of the root", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        expect(tree.depth(tree.getByID(ID_A0))).toBe(1);
    });

    it("returns 2 for a grandchild of the root", () => {
        tree.addNode(ID_A0, "a", tree.root, "R");
        const parent = tree.getByID(ID_A0);
        tree.addNode(ID_A1, "b", parent, "R");
        expect(tree.depth(tree.getByID(ID_A1))).toBe(2);
    });
});

// ---------------------------------------------------------------------------
// updateSize
// ---------------------------------------------------------------------------

describe("FTree.updateSize", () => {
    it("propagates delta up through all ancestors", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        const nodeA0 = tree.getByID(ID_A0);
        tree.addNode(ID_A1, "b", nodeA0, "R");
        const nodeA1 = tree.getByID(ID_A1);

        tree.updateSize(nodeA1, 3);

        expect(nodeA1.size).toBe(4); // 1 (from addNode) + 3
        expect(nodeA0.size).toBe(5); // 2 (from addNode calls) + 3
        expect(tree.root.size).toBe(5); // 2 + 3
    });

    it("decrements correctly when delta is negative", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        const nodeA0 = tree.getByID(ID_A0);
        tree.updateSize(nodeA0, -1);
        expect(nodeA0.size).toBe(0);
        expect(tree.root.size).toBe(0);
    });
});

// ---------------------------------------------------------------------------
// getByIndex
// ---------------------------------------------------------------------------

describe("FTree.getByIndex", () => {
    let tree: FTree;
    beforeEach(() => {
        tree = new FTree();
        buildHelloTree(tree); // inserts "hello" under root
    });

    it("returns the first character at index 0", () => {
        expect(tree.getByIndex(tree.root, 0).value).toBe("h");
    });

    it("returns the last character at index size-1", () => {
        expect(tree.getByIndex(tree.root, tree.root.size - 1).value).toBe("o");
    });

    it("returns interior characters at their correct indices", () => {
        expect(tree.getByIndex(tree.root, 1).value).toBe("e");
        expect(tree.getByIndex(tree.root, 2).value).toBe("l");
    });

    it("throws for a negative index", () => {
        expect(() => tree.getByIndex(tree.root, -1)).toThrow(/Index out of bounds/);
    });

    it("throws when index equals tree size", () => {
        expect(() => tree.getByIndex(tree.root, tree.root.size)).toThrow(/Index out of bounds/);
    });

    it("skips deleted nodes when computing the index", () => {
        // Mark 'e' (counter 1) as deleted and reduce sizes accordingly.
        const eNode = tree.getByID({ sender: "A", counter: 1 });
        eNode.isDeleted = true;
        tree.updateSize(eNode, -1);
        // After deletion of 'e', index 1 should now be the first 'l'.
        expect(tree.getByIndex(tree.root, 1).value).toBe("l");
    });
});

// ---------------------------------------------------------------------------
// getVisibleIndex
// ---------------------------------------------------------------------------

describe("FTree.getVisibleIndex", () => {
    let tree: FTree;
    beforeEach(() => {
        tree = new FTree();
        buildHelloTree(tree);
    });

    it("returns 0 for the first visible node", () => {
        const first = tree.getByID({ sender: "A", counter: 0 });
        expect(tree.getVisibleIndex(first)).toBe(0);
    });

    it("returns size-1 for the last visible node", () => {
        const last = tree.getByID({ sender: "A", counter: 4 });
        expect(tree.getVisibleIndex(last)).toBe(4);
    });

    it("returns the correct index for an interior node", () => {
        const l1 = tree.getByID({ sender: "A", counter: 2 });
        expect(tree.getVisibleIndex(l1)).toBe(2);
    });

    it("getByIndex and getVisibleIndex are inverses for each visible position", () => {
        for (let i = 0; i < tree.root.size; i++) {
            const node = tree.getByIndex(tree.root, i);
            expect(tree.getVisibleIndex(node)).toBe(i);
        }
    });
});

// ---------------------------------------------------------------------------
// leftmostDescendant
// ---------------------------------------------------------------------------

describe("FTree.leftmostDescendant", () => {
    it("returns the node itself when it has no left children", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        const node = tree.getByID(ID_A0);
        expect(tree.leftmostDescendant(node)).toBe(node);
    });

    it("returns the deepest left descendant when left children exist", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        const nodeA = tree.getByID(ID_A0);
        tree.addNode(ID_B0, "b", nodeA, "L");
        const nodeB = tree.getByID(ID_B0);
        tree.addNode(ID_C0, "c", nodeB, "L");
        expect(tree.leftmostDescendant(nodeA)).toBe(tree.getByID(ID_C0));
    });
});

// ---------------------------------------------------------------------------
// nextNonDescendant
// ---------------------------------------------------------------------------

describe("FTree.nextNonDescendant", () => {
    it("returns null for the last node in the tree", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        expect(tree.nextNonDescendant(tree.getByID(ID_A0))).toBeNull();
    });

    it("returns the next right sibling's leftmost descendant when a next sibling exists", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R", null);
        tree.addNode(ID_B0, "b", tree.root, "R", null);
        const nodeA = tree.getByID(ID_A0);
        const nodeB = tree.getByID(ID_B0);
        expect(tree.nextNonDescendant(nodeA)).toBe(tree.leftmostDescendant(nodeB));
    });

    it("returns the parent when a left child has no further right siblings", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        const nodeA = tree.getByID(ID_A0);
        tree.addNode(ID_B0, "b", nodeA, "L");
        const nodeB = tree.getByID(ID_B0);
        expect(tree.nextNonDescendant(nodeB)).toBe(nodeA);
    });
});

// ---------------------------------------------------------------------------
// traverse
// ---------------------------------------------------------------------------

describe("FTree.traverse", () => {
    it("yields characters in document order for a linear right-child chain", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        expect([...tree.traverse(tree.root)]).toEqual(["h", "e", "l", "l", "o"]);
    });

    it("yields no characters for a tree containing only the root", () => {
        const tree = new FTree();
        expect([...tree.traverse(tree.root)]).toEqual([]);
    });

    it("skips deleted nodes during traversal", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        const eNode = tree.getByID({ sender: "A", counter: 1 });
        eNode.isDeleted = true;
        tree.updateSize(eNode, -1);
        expect([...tree.traverse(tree.root)]).toEqual(["h", "l", "l", "o"]);
    });

    it("yields left-subtree characters before the parent and right-subtree characters after", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "m", tree.root, "R");
        const nodeA = tree.getByID(ID_A0);
        tree.addNode(ID_B0, "l", nodeA, "L");
        tree.addNode(ID_C0, "r", nodeA, "R");
        expect([...tree.traverse(tree.root)]).toEqual(["l", "m", "r"]);
    });

    it("skips subtrees whose size is 0 during traversal", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        const nodeA = tree.getByID(ID_A0);
        // Add a child whose size we artificially zero out so the traversal skips it.
        tree.addNode(ID_B0, "b", nodeA, "R");
        const nodeB = tree.getByID(ID_B0);
        nodeB.size = 0;
        nodeA.size = 1;
        tree.root.size = 1;
        expect([...tree.traverse(tree.root)]).toEqual(["a"]);
    });
});

// ---------------------------------------------------------------------------
// save / load round-trip
// ---------------------------------------------------------------------------

describe("FTree save/load", () => {
    it("round-trips an empty tree correctly", () => {
        const tree = new FTree();
        const data = tree.save();
        const loaded = new FTree();
        loaded.load(data);
        expect([...loaded.traverse(loaded.root)]).toEqual([]);
        expect(loaded.root.size).toBe(0);
    });

    it("round-trips a populated tree preserving document order", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        const data = tree.save();
        const loaded = new FTree();
        loaded.load(data);
        expect([...loaded.traverse(loaded.root)]).toEqual(["h", "e", "l", "l", "o"]);
    });

    it("round-trips a tree with deleted nodes, preserving deletion state", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        const eNode = tree.getByID({ sender: "A", counter: 1 });
        eNode.isDeleted = true;
        tree.updateSize(eNode, -1);
        const data = tree.save();
        const loaded = new FTree();
        loaded.load(data);
        expect([...loaded.traverse(loaded.root)]).toEqual(["h", "l", "l", "o"]);
    });

    it("round-trips a tree that has nodes with explicit rightOrigin pointers", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R", null);
        tree.addNode(ID_A1, "b", tree.root, "R", null);
        // Insert between A0 and A1 by referencing A1 as rightOrigin.
        tree.addNode(ID_B0, "x", tree.root, "R", ID_A1);
        const data = tree.save();
        const loaded = new FTree();
        loaded.load(data);
        expect([...loaded.traverse(loaded.root)]).toEqual([...tree.traverse(tree.root)]);
    });

    it("preserves node sizes after a round-trip", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        const data = tree.save();
        const loaded = new FTree();
        loaded.load(data);
        expect(loaded.root.size).toBe(5);
    });

    it("save produces a non-empty Uint8Array", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        const data = tree.save();
        expect(data).toBeInstanceOf(Uint8Array);
        expect(data.length).toBeGreaterThan(0);
    });
});

// ---------------------------------------------------------------------------
// clear
// ---------------------------------------------------------------------------

describe("FTree.clear", () => {
    it("resets size to 0 after clearing a populated tree", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        tree.clear();
        expect(tree.root.size).toBe(0);
    });

    it("removes all non-root nodes from the node map", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        tree.clear();
        expect(tree.getNodes().size).toBe(1); // only the "" root entry
    });

    it("empties root's left and right children arrays", () => {
        const tree = new FTree();
        tree.addNode(ID_A0, "a", tree.root, "R");
        tree.addNode(ID_B0, "b", tree.root, "L");
        tree.clear();
        expect(tree.root.leftChildren).toHaveLength(0);
        expect(tree.root.rightChildren).toHaveLength(0);
    });

    it("allows new nodes to be added after a clear", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        tree.clear();
        tree.addNode(ID_A0, "z", tree.root, "R");
        expect(tree.root.size).toBe(1);
        expect([...tree.traverse(tree.root)]).toEqual(["z"]);
    });

    it("re-registers the root under the empty-string sender key after clearing", () => {
        const tree = new FTree();
        buildHelloTree(tree);
        tree.clear();
        expect(tree.getNodes().get("")?.[0]).toBe(tree.root);
    });
});
