import crypto from "node:crypto";
import { FugueList, FugueTree, StringTotalOrder } from "../../../dts/index.js";
import { FugueMessage, Operation, MessageType } from "../../../types/index.js";

export const DOC_ID = "test-doc";
export const USER_ID = "test-user";

/**
 * A fresh FugueTree with no WebSocket and stable IDs for deterministic tests.
 */
export function makeFugueTree(): FugueTree {
    return new FugueTree(null, DOC_ID, USER_ID);
}

export const emptyFugueTree = makeFugueTree();

/**
 * Build a FugueTree pre-populated with the given string via insertMultiple.
 */
export function treeWithText(text: string): FugueTree {
    const tree = makeFugueTree();
    const msgs = tree.insertMultiple(0, text);
    msgs.forEach((msg) => {
        /* already applied inside insertMultiple */
    });
    return tree;
}

/**
 * Craft a minimal FugueMessage from one replica so that effect() can be
 * called on a different replica. The parent ID must match the root node
 * ({sender:"", counter:0}).
 */
export function makeForeignInsertMsg(
    replicaId: string,
    counter: number,
    data: string,
    documentID: string = DOC_ID,
): FugueMessage {
    return {
        msgType: MessageType.FUGUE,
        operation: Operation.INSERT,
        replicaId,
        userIdentity: "foreign-user",
        documentID,
        id: { sender: replicaId, counter },
        data,
        parent: { sender: "", counter: 0 },
        side: "R",
    };
}

export function makeForeignDeleteMsg(
    replicaId: string,
    targetId: { sender: string; counter: number },
    documentID: string = DOC_ID,
): FugueMessage {
    return {
        msgType: MessageType.FUGUE,
        operation: Operation.DELETE,
        replicaId,
        userIdentity: "foreign-user",
        documentID,
        id: targetId,
        data: null,
        side: "R",
    };
}
