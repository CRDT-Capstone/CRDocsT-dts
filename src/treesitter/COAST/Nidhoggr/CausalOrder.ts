import { FugueMessage } from "../../../types/index.js";

export type Txn = {
    msgs: FugueMessage[];
};

/**
 * Determines if two COAST transactions are causally concurrent.
 * Two transactions are concurrent if they originate from different replicas and neither could have
 * been observed by the other before sending, i.e. there is no causal relationship between them.
 * @returns true if the transactions are concurrent, false if they are causally ordered (one could have observed the other).
 * NOTE: This is a simplified heuristic based on replica IDs and does not consider the full causal history or logical timestamps,
 * which would be needed for a more robust implementation.
 */
export const areConcurrent = (txnA: Txn, txnB: Txn): boolean => {
    const repA = txnA.msgs[0].replicaId;
    const repB = txnB.msgs[0].replicaId;

    // If the transactions are from the same replica, we can assume they are not concurrent, they are causally ordered.
    if (repA === repB) return false;

    return true;
};

/**
 * Determine the logical time of a transaction based on the minimum counter value of its messages.
 */
export const logicalTimeOf = (msgs: FugueMessage[]): number => {
    return Math.min(...msgs.map((m) => m.id.counter));
};
