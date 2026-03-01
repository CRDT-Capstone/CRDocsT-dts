import { FugueMessage } from "../../../types";
import { OperationType } from "../../Actions";

/**
 * Every distinct conflict scenario that can arise between two concurrent
 * COAST operations on the same AST node.
 *
 * Uses the naming convention: <LOSER>_ECLIPSED_BY_<WINNER>
 * where WINNER is the operation that was applied and took effect,
 * and LOSER is the operation whose effect is now inconsistent or orphaned.
 */
export enum ConflictType {
    // Two replicas both ADDed a node with the same key simultaneously.
    // The second ADD creates a duplicate in the FugueTree.
    DUPLICATE_ADD = "DUPLICATE_ADD",
    // A replica UPDATEd a node, but another replica MOVEd it first.
    // The UPDATE's characters are now orphaned next to tombstones at the old location.
    UPDATE_ON_STALE_LOCATION = "UPDATE_ON_STALE_LOCATION",
    // A replica MOVEd a node, but another replica MOVEd the same node to a different target.
    // Both MOVEs applied: the content now exists in TWO locations.
    CONCURRENT_MOVE_DUPLICATE = "CONCURRENT_MOVE_DUPLICATE",
    // A replica DELETEd a node, but another replica MOVEd it first.
    // The MOVE's INSERT copy exists at the new location; then the DELETE tombstoned
    // the old location. Result: content exists at new location but registry says deleted.
    MOVE_OF_DELETED_NODE = "MOVE_OF_DELETED_NODE",
    // A replica DELETEd a node, but another replica was concurrently UPDATEing it.
    // The UPDATE's new characters are now orphaned (inserted next to tombstones of the deleted span).
    UPDATE_OF_DELETED_NODE = "UPDATE_OF_DELETED_NODE",
    // A replica ADDed a node with a key that the registry already contains.
    // Indicates a logic error in the AST differ or a replayed message.
    ADD_OF_EXISTING_NODE = "ADD_OF_EXISTING_NODE",
    // A replica tried to MOVE/UPDATE/DELETE a node that the registry no longer tracks
    // (it was already deleted by a concurrent operation).
    OPERATION_ON_MISSING_NODE = "OPERATION_ON_MISSING_NODE",
}

export type IncomingTxn = {
    txnId: string;
    opType: OperationType;
    msgs: FugueMessage[];
};

export interface IncomingOpSummary {
    txnId: string;
    opType: OperationType;
    replicaId: string;
    logicalTime: number;
}

export enum AutoRecoveryStrategy {
    RE_APPLY_UPDATE_AT_NEW_ANCHOR = "RE_APPLY_UPDATE_AT_NEW_ANCHOR",
    REMOVE_DUPLICATE = "REMOVE_DUPLICATE",
    RESTORE_REGISTRY_ENTRY = "RESTORE_REGISTRY_ENTRY",
    NOTIFY_USER = "NOTIFY_USER",
}

export type RecoverySuggestion =
    | { strategy: AutoRecoveryStrategy.RE_APPLY_UPDATE_AT_NEW_ANCHOR; newAnchorNodeKey: string }
    | { strategy: AutoRecoveryStrategy.REMOVE_DUPLICATE; keepTxId: string; discardTxId: string }
    | { strategy: AutoRecoveryStrategy.RESTORE_REGISTRY_ENTRY; fromTxId: string }
    | { strategy: AutoRecoveryStrategy.NOTIFY_USER };

export interface Conflict {
    type: ConflictType;
    prior: NodeHistoryEntry;
    incoming: IncomingOpSummary;
    nodeKey: string;
    autoRecoverable: boolean;
    recoverySuggestion?: RecoverySuggestion;
    desc: string;
}

export interface NodeHistoryEntry {
    txnId: string;
    opType: OperationType;
    replicaId: string;
    userIdentity: string;
    logicalTime: number;
    appliedAt: number;
}

export type ConflictHandler = (conflict: Conflict) => void;

export type TxnSnapshot = {
    txnId: string;
    opType: string;
    msgCount: number;
    ageMs: number;
};

export type NidhoggrOptions = {
    txnTtlMs?: number;
    onConflict?: ConflictHandler;
};
