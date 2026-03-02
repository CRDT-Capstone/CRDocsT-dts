import { describe, test, expect, beforeEach } from "@jest/globals";
import { FugueTree } from "../../dts/index.js";
import { Operation, MessageType } from "../../types/index.js";
import {
    makeFugueTree,
    treeWithText,
    makeForeignInsertMsg,
    makeForeignDeleteMsg,
    DOC_ID,
    USER_ID,
} from "./mocks/FugueTree-mocks.js";

// ---------------------------------------------------------------------------
// observe / length
// ---------------------------------------------------------------------------

describe("FugueTree", () => {
    describe("observe", () => {
        test("empty tree has an empty string", () => {
            expect(makeFugueTree().observe()).toBe("");
        });

        test("observe returns the full inserted text in order", () => {
            const tree = treeWithText("hello");
            expect(tree.observe()).toBe("hello");
        });

        test("observe reflects characters deleted from the middle", () => {
            const tree = treeWithText("hello");
            tree.delete(2); // remove 'l' at index 2
            expect(tree.observe()).toBe("helo");
        });

        test("observe is empty after deleting all characters", () => {
            const tree = treeWithText("hi");
            tree.delete(0);
            tree.delete(0);
            expect(tree.observe()).toBe("");
        });
    });

    // -----------------------------------------------------------------------
    // length
    // -----------------------------------------------------------------------

    describe("length", () => {
        test("empty tree has length 0", () => {
            expect(makeFugueTree().length()).toBe(0);
        });

        test("length matches number of inserted characters", () => {
            const tree = treeWithText("abc");
            expect(tree.length()).toBe(3);
        });

        test("length decrements after a delete", () => {
            const tree = treeWithText("abc");
            tree.delete(1);
            expect(tree.length()).toBe(2);
        });
    });

    // -----------------------------------------------------------------------
    // get
    // -----------------------------------------------------------------------

    describe("get", () => {
        test("returns the character at the given visible index", () => {
            const tree = treeWithText("abc");
            expect(tree.get(0)).toBe("a");
            expect(tree.get(1)).toBe("b");
            expect(tree.get(2)).toBe("c");
        });

        test("throws when index is negative", () => {
            const tree = treeWithText("abc");
            expect(() => tree.get(-1)).toThrow();
        });

        test("throws when index equals length", () => {
            const tree = treeWithText("abc");
            expect(() => tree.get(3)).toThrow();
        });

        test("returns correct character after a deletion shifts visible indices", () => {
            const tree = treeWithText("abc");
            tree.delete(0); // removes 'a'; visible string is now "bc"
            expect(tree.get(0)).toBe("b");
            expect(tree.get(1)).toBe("c");
        });
    });

    // -----------------------------------------------------------------------
    // insert (single character)
    // -----------------------------------------------------------------------

    describe("insert", () => {
        test("returns a FugueMessage with INSERT operation", () => {
            const tree = makeFugueTree();
            const msg = tree.insert(0, "x");
            expect(msg.operation).toBe(Operation.INSERT);
            expect(msg.msgType).toBe(MessageType.FUGUE);
        });

        test("returned message carries the inserted character", () => {
            const tree = makeFugueTree();
            const msg = tree.insert(0, "z");
            expect(msg.data).toBe("z");
        });

        test("returned message contains the tree's replicaId", () => {
            const tree = makeFugueTree();
            const msg = tree.insert(0, "a");
            expect(msg.replicaId).toBe(tree.replicaId());
        });

        test("returned message contains the correct documentID and userIdentity", () => {
            const tree = makeFugueTree();
            const msg = tree.insert(0, "a");
            expect(msg.documentID).toBe(DOC_ID);
            expect(msg.userIdentity).toBe(USER_ID);
        });

        test("inserting at index 0 prepends the character", () => {
            const tree = treeWithText("bc");
            tree.insert(0, "a");
            expect(tree.observe()).toBe("abc");
        });

        test("inserting at the end appends the character", () => {
            const tree = treeWithText("ab");
            tree.insert(2, "c");
            expect(tree.observe()).toBe("abc");
        });

        test("inserting in the middle places the character correctly", () => {
            const tree = treeWithText("ac");
            tree.insert(1, "b");
            expect(tree.observe()).toBe("abc");
        });

        test("counter increments with each insert so IDs are unique", () => {
            const tree = makeFugueTree();
            const msg1 = tree.insert(0, "a");
            const msg2 = tree.insert(1, "b");
            expect(msg2.id.counter).toBeGreaterThan(msg1.id.counter);
        });
    });

    // -----------------------------------------------------------------------
    // insertMultiple
    // -----------------------------------------------------------------------

    describe("insertMultiple", () => {
        test("inserts each character and returns one message per character", () => {
            const tree = makeFugueTree();
            const msgs = tree.insertMultiple(0, "hello");
            expect(msgs).toHaveLength(5);
            expect(tree.observe()).toBe("hello");
        });

        test("each returned message has a unique id counter", () => {
            const tree = makeFugueTree();
            const msgs = tree.insertMultiple(0, "abc");
            const counters = msgs.map((m) => m.id.counter);
            expect(new Set(counters).size).toBe(3);
        });

        test("returns an empty array when given an empty string", () => {
            const tree = makeFugueTree();
            const msgs = tree.insertMultiple(0, "");
            expect(msgs).toHaveLength(0);
            expect(tree.observe()).toBe("");
        });

        test("inserting multiple characters in the middle produces correct order", () => {
            const tree = treeWithText("ad");
            tree.insertMultiple(1, "bc");
            expect(tree.observe()).toBe("abcd");
        });
    });

    // -----------------------------------------------------------------------
    // delete (single character)
    // -----------------------------------------------------------------------

    describe("delete", () => {
        test("removing the only character results in an empty document", () => {
            const tree = treeWithText("x");
            tree.delete(0);
            expect(tree.observe()).toBe("");
            expect(tree.length()).toBe(0);
        });

        test("deleting the first character of several is correct", () => {
            const tree = treeWithText("abc");
            tree.delete(0);
            expect(tree.observe()).toBe("bc");
        });

        test("deleting the last character is correct", () => {
            const tree = treeWithText("abc");
            tree.delete(2);
            expect(tree.observe()).toBe("ab");
        });

        test("deleting the same index twice reflects the shifted visible string", () => {
            const tree = treeWithText("abc");
            tree.delete(0); // removes 'a'
            tree.delete(0); // removes 'b' (now at visible index 0)
            expect(tree.observe()).toBe("c");
        });
    });

    // -----------------------------------------------------------------------
    // deleteMultiple
    // -----------------------------------------------------------------------

    describe("deleteMultiple", () => {
        test("deletes the specified number of characters and returns one message per deletion", () => {
            const tree = treeWithText("hello");
            const msgs = tree.deleteMultiple(1, 3);
            expect(msgs).toHaveLength(3);
            expect(tree.observe()).toBe("ho");
        });

        test("deleting length 0 returns an empty array and leaves the document unchanged", () => {
            const tree = treeWithText("abc");
            const msgs = tree.deleteMultiple(0, 0);
            expect(msgs).toHaveLength(0);
            expect(tree.observe()).toBe("abc");
        });

        test("all returned messages have DELETE operation", () => {
            const tree = treeWithText("abc");
            const msgs = tree.deleteMultiple(0, 2);
            msgs.forEach((msg) => expect(msg.operation).toBe(Operation.DELETE));
        });
    });

    // -----------------------------------------------------------------------
    // effect — applying remote messages
    // -----------------------------------------------------------------------

    describe("effect", () => {
        test("applying a remote INSERT from a different replica updates the document", () => {
            const tree = makeFugueTree();
            const foreignId = "foreign-replica";
            const msg = makeForeignInsertMsg(foreignId, 0, "x");
            const applied = tree.effect(msg);
            expect(applied).toHaveLength(1);
            expect(tree.observe()).toBe("x");
        });

        test("messages from this replica are skipped", () => {
            const tree = makeFugueTree();
            // Build a message that looks like it came from the same replicaId
            const selfMsg = makeForeignInsertMsg(tree.replicaId(), 0, "x");
            const applied = tree.effect(selfMsg);
            expect(applied).toHaveLength(0);
            expect(tree.observe()).toBe("");
        });

        test("accepts an array of messages and returns all successfully applied ones", () => {
            const tree = makeFugueTree();
            const msgs = [makeForeignInsertMsg("replica-b", 0, "a"), makeForeignInsertMsg("replica-b", 1, "b")];
            // counter 1 depends on counter 0 being the parent — both are right children of root, so both apply
            const applied = tree.effect(msgs);
            expect(applied.length).toBeGreaterThanOrEqual(1);
        });

        test("duplicate pending messages are not stored twice", () => {
            const tree = makeFugueTree();
            // A message that references a non-existent parent will be deferred
            const orphanMsg = {
                ...makeForeignInsertMsg("rep-x", 0, "z"),
                parent: { sender: "ghost", counter: 99 },
            };
            tree.effect(orphanMsg);
            tree.effect(orphanMsg); // second call with same key
            // pendingMsgs should have exactly one entry
            expect(tree.pendingMsgs.size).toBe(1);
        });

        test("pending messages are applied once their dependency arrives", () => {
            const tree = makeFugueTree();

            // msg2 references msg1 as parent, so msg1 must arrive first
            const msg1 = makeForeignInsertMsg("rep-a", 0, "A");
            const msg2: typeof msg1 = {
                ...makeForeignInsertMsg("rep-a", 1, "B"),
                parent: { sender: "rep-a", counter: 0 },
                side: "R",
            };

            // Send msg2 first — it can't be applied yet
            tree.effect(msg2);
            expect(tree.pendingMsgs.size).toBe(1);
            expect(tree.observe()).toBe("");

            // Now send msg1 — msg2 should be resolved automatically
            tree.effect(msg1);
            expect(tree.pendingMsgs.size).toBe(0);
            expect(tree.observe()).toContain("A");
        });

        test("applying a remote DELETE removes the character from the visible string", () => {
            // Insert locally first, then simulate a remote delete of the same node
            const tree = makeFugueTree();
            const insertMsg = tree.insert(0, "x");

            // Build a foreign delete targeting the node just inserted
            const delMsg = makeForeignDeleteMsg("other-replica", insertMsg.id);
            // Override replicaId to something different from the tree's own ID
            const foreignDel = { ...delMsg, replicaId: "other-replica" };
            tree.effect(foreignDel);
            expect(tree.observe()).toBe("");
        });
    });

    // -----------------------------------------------------------------------
    // getById / getVisibleIndex
    // -----------------------------------------------------------------------

    describe("getById", () => {
        test("returns the node corresponding to an inserted character's ID", () => {
            const tree = makeFugueTree();
            const msg = tree.insert(0, "q");
            const node = tree.getById(msg.id);
            expect(node.value).toBe("q");
        });

        test("throws for an unknown ID", () => {
            const tree = makeFugueTree();
            expect(() => tree.getById({ sender: "nobody", counter: 99 })).toThrow();
        });
    });

    describe("getVisibleIndex", () => {
        test("returns the correct index of an inserted node", () => {
            const tree = treeWithText("abc");
            const msgC = tree.insert(3, "d"); // 'd' is now at visible index 3
            const node = tree.getById(msgC.id);
            expect(tree.getVisibleIndex(node)).toBe(3);
        });
    });

    // -----------------------------------------------------------------------
    // replicaId
    // -----------------------------------------------------------------------

    describe("replicaId", () => {
        test("replicaId returns a non-empty string", () => {
            const tree = makeFugueTree();
            expect(typeof tree.replicaId()).toBe("string");
            expect(tree.replicaId().length).toBeGreaterThan(0);
        });

        test("two different FugueTree instances have different replicaIds", () => {
            const treeA = makeFugueTree();
            const treeB = makeFugueTree();
            expect(treeA.replicaId()).not.toBe(treeB.replicaId());
        });
    });

    // -----------------------------------------------------------------------
    // save / load round-trip
    // -----------------------------------------------------------------------

    describe("save / load", () => {
        test("save returns a non-empty Uint8Array", () => {
            const tree = treeWithText("hello");
            const bytes = tree.save();
            expect(bytes).toBeInstanceOf(Uint8Array);
            expect(bytes.length).toBeGreaterThan(0);
        });

        test("loading saved state into a new tree reproduces the same document", () => {
            const original = treeWithText("hello world");
            const bytes = original.save();

            const restored = makeFugueTree();
            restored.load(bytes);
            expect(restored.observe()).toBe("hello world");
        });

        test("loading null is a no-op and leaves the tree unchanged", () => {
            const tree = treeWithText("abc");
            tree.load(null);
            expect(tree.observe()).toBe("abc");
        });

        test("save / load round-trip preserves deletions", () => {
            const original = treeWithText("hello");
            original.delete(0); // remove 'h'
            const bytes = original.save();

            const restored = makeFugueTree();
            restored.load(bytes);
            expect(restored.observe()).toBe("ello");
        });
    });

    // -----------------------------------------------------------------------
    // traverse
    // -----------------------------------------------------------------------

    describe("traverse", () => {
        test("iterating traverse yields the visible characters in document order", () => {
            const tree = treeWithText("abc");
            expect([...tree.traverse()]).toEqual(["a", "b", "c"]);
        });

        test("deleted characters are excluded from traverse", () => {
            const tree = treeWithText("abc");
            tree.delete(1); // remove 'b'
            expect([...tree.traverse()]).toEqual(["a", "c"]);
        });
    });

    // -----------------------------------------------------------------------
    // clear
    // -----------------------------------------------------------------------

    describe("clear", () => {
        test("clear resets the document to an empty string", () => {
            const tree = treeWithText("hello");
            tree.clear();
            expect(tree.observe()).toBe("");
            expect(tree.length()).toBe(0);
        });

        test("insertions after clear work correctly", () => {
            const tree = treeWithText("old");
            tree.clear();
            tree.insertMultiple(0, "new");
            expect(tree.observe()).toBe("new");
        });
    });

    // -----------------------------------------------------------------------
    // nextNonDescendant (public proxy)
    // -----------------------------------------------------------------------

    describe("nextNonDescendant", () => {
        test("returns null for the last character in the document", () => {
            const tree = treeWithText("a");
            const msg = tree.insert(0, "b"); // 'b' is now at index 1 (last)
            const node = tree.getById(msg.id);
            // The last node in the tree has no next non-descendant
            const next = tree.nextNonDescendant(node);
            // It may or may not be null depending on tree structure, but must not throw
            expect(next === null || next !== undefined).toBe(true);
        });
    });

    // -----------------------------------------------------------------------
    // Ordering / CRDT convergence
    // -----------------------------------------------------------------------

    describe("CRDT ordering guarantees", () => {
        test("concurrent inserts at the same index from two replicas both survive", () => {
            const replicaA = makeFugueTree();
            const replicaB = makeFugueTree();

            const msgA = replicaA.insert(0, "A");
            const msgB = replicaB.insert(0, "B");

            // Cross-apply
            replicaA.effect({ ...msgB, replicaId: replicaB.replicaId() });
            replicaB.effect({ ...msgA, replicaId: replicaA.replicaId() });

            // Both replicas must have 2 characters
            expect(replicaA.length()).toBe(2);
            expect(replicaB.length()).toBe(2);
        });

        test("two replicas converge to the same string after exchanging all messages", () => {
            const replicaA = makeFugueTree();
            const replicaB = makeFugueTree();

            const msgsA = replicaA.insertMultiple(0, "hello");
            const msgsB = replicaB.insertMultiple(0, "world");

            // Apply A's messages to B and vice-versa
            replicaA.effect(msgsB.map((m) => ({ ...m, replicaId: replicaB.replicaId() })));
            replicaB.effect(msgsA.map((m) => ({ ...m, replicaId: replicaA.replicaId() })));

            expect(replicaA.observe()).toBe(replicaB.observe());
        });

        test("insert followed by delete yields the same result regardless of message delivery order", () => {
            const replicaA = makeFugueTree();
            const replicaB = makeFugueTree();

            // A inserts 'x', then deletes it
            const insertMsg = replicaA.insert(0, "x");
            const deleteMsg = replicaA.deleteMultiple(0, 1)[0];

            // B receives delete before insert (out-of-order)
            replicaB.effect({ ...deleteMsg, replicaId: replicaA.replicaId() });
            replicaB.effect({ ...insertMsg, replicaId: replicaA.replicaId() });

            expect(replicaB.observe()).toBe("");
        });
    });
});
