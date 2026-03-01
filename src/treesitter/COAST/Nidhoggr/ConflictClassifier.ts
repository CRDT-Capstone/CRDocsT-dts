import { FugueMessage } from "../../../types/index.js";
import {
    AutoRecoveryStrategy,
    Conflict,
    ConflictType,
    IncomingOpSummary,
    IncomingTxn,
    NodeHistoryEntry,
} from "./types.js";
import { logicalTimeOf } from "./CausalOrder.js";

/**
 * Classifies a potential conflict between a prior operation (already applied) and an incoming operation (just received).
 * Returns a Conflict object with details and recovery suggestions if it's a known conflict scenario, or null if it's not a conflict.
 * @param prior The prior operation's history entry from the registry.
 * @param incomingTx The incoming transaction details, including txnId, opType, and associated messages.
 * @param registryHasNode Boolean indicating whether the registry currently has an entry for the node (used for certain conflict classifications).
 */
export const classifyConflict = (
    nodeKey: string,
    prior: NodeHistoryEntry,
    incomingTx: IncomingTxn,
    registryHasNode: boolean,
): Conflict | null => {
    const incoming: IncomingOpSummary = {
        txnId: incomingTx.txnId,
        opType: incomingTx.opType,
        replicaId: incomingTx.msgs[0]?.replicaId ?? "unknown",
        logicalTime: logicalTimeOf(incomingTx.msgs),
    };

    // If the incoming operation is causally after the prior operation, it's not a conflict.
    if (prior.txnId === incoming.txnId) return null;

    // If the operations are from the same replica, we can assume they are causally ordered and not a conflict.
    if (prior.replicaId === incoming.replicaId) return null;

    // If the incoming operation's logical time is before the prior operation's logical time, it's not a conflict (the prior op causally happened after the incoming op).
    if (incoming.logicalTime < prior.logicalTime) {
        return null;
    }

    switch (prior.opType) {
        case "ADD":
            return classifyAfterAdd(nodeKey, prior, incoming, registryHasNode);
        case "UPDATE":
            return classifyAfterUpdate(nodeKey, prior, incoming, registryHasNode);
        case "MOVE":
            return classifyAfterMove(nodeKey, prior, incoming, registryHasNode);
        case "DELETE":
            return classifyAfterDelete(nodeKey, prior, incoming);
    }
};

/**
 * Classify conflicts where the prior operation was an ADD. This includes cases like:
 * - Concurrent ADDs of the same node key by different replicas (duplicate content).
 * - Mutations (UPDATE/MOVE/DELETE) on a node that was just added by another replica, which may be normal causal ordering or could indicate a problem if the registry doesn't have the node yet.
 * - ADD after DELETE (resurrection) if the registry doesn't have the node anymore.
 * - ADD after UPDATE/MOVE/DELETE of the same key, which could indicate a replayed or out-of-order message.
 * - Other edge cases around the timing of when the ADD was applied relative to the incoming operation.
 * @param nodeKey - The key of the node being operated on
 * @param prior - The history entry of the prior operation that was already applied
 * @param incoming - A summary of the incoming operation that is being classified against the prior operation
 * @param registryHasNode - Boolean indicating whether the registry currently has an entry for the node key
 */
const classifyAfterAdd = (
    nodeKey: string,
    prior: NodeHistoryEntry,
    incoming: IncomingOpSummary,
    registryHasNode: boolean,
): Conflict | null => {
    switch (incoming.opType) {
        // Two replicas both created the same node key simultaneously.
        case "ADD":
            return {
                type: ConflictType.DUPLICATE_ADD,
                nodeKey,
                prior,
                incoming,
                desc: `Replica "${incoming.replicaId}" and replica "${prior.replicaId}" both added node "${nodeKey}" concurrently. The FugueTree now contains two copies of this content.`,
                autoRecoverable: true,
                recoverySuggestion: {
                    strategy: AutoRecoveryStrategy.REMOVE_DUPLICATE,
                    // Keep the lexicographically larger replicaId as a deterministic tiebreak.
                    keepTxId: incoming.replicaId > prior.replicaId ? incoming.txnId : prior.txnId,
                    discardTxId: incoming.replicaId > prior.replicaId ? prior.txnId : incoming.txnId,
                },
            };

        // Prior was ADD, incoming is a mutation. This is normal causal ordering
        // as long as the registry has the node (if not, something went wrong).
        case "UPDATE":
        case "MOVE":
        case "DELETE":
            if (!registryHasNode) {
                return {
                    type: ConflictType.OPERATION_ON_MISSING_NODE,
                    nodeKey,
                    prior,
                    incoming,
                    desc: `Incoming ${incoming.opType} on node "${nodeKey}" but the registry has no entry for it (ADD may not have been applied yet).`,
                    autoRecoverable: false,
                    recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
                };
            }
            return null; // Normal: prior ADD, now being operated on. No conflict.
    }
};

/**
 * Classify conflicts where the prior operation was an UPDATE. This includes cases like:
 * - Concurrent UPDATEs to the same node by different replicas, which may result in semantically merged content that could be invalid.
 * - MOVE or DELETE of a node that was concurrently UPDATEd, where the MOVE/DELETE may have read stale content and the UPDATE's changes are now orphaned.
 * - ADD of the same node key after an UPDATE, which could indicate a replayed or out-of-order message since the node already exists.
 * - Other edge cases around the timing of when the UPDATE was applied relative to the incoming operation.
 * @param nodeKey - The key of the node being operated on
 * @param prior - The history entry of the prior UPDATE operation that was already applied
 * @param incoming - A summary of the incoming operation that is being classified against the prior UPDATE operation
 * @param registryHasNode - Boolean indicating whether the registry currently has an entry for the node key
 */
function classifyAfterUpdate(
    nodeKey: string,
    prior: NodeHistoryEntry,
    incoming: IncomingOpSummary,
    registryHasNode: boolean,
): Conflict | null {
    switch (incoming.opType) {
        // Two replicas concurrently updated the same node.
        // FugueTree handles the character-level ordering correctly
        // but the content is semantically merged in a
        // potentially nonsensical way for structured AST nodes.
        case "UPDATE":
            return {
                type: ConflictType.UPDATE_ON_STALE_LOCATION,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Two concurrent UPDATEs on node "${nodeKey}" from replicas "${prior.replicaId}" and "${incoming.replicaId}". ` +
                    `Both sets of inserted characters are present in the FugueTree but the result may not be valid AST content.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };

        // Incoming MOVE on a node that was already UPDATEd by a prior op.
        // The MOVE read stale content (before the UPDATE was applied) and
        // copied it to the new location. The UPDATE's new characters are
        // orphaned adjacent to the tombstones of the old span.
        case "MOVE":
            return {
                type: ConflictType.UPDATE_ON_STALE_LOCATION,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replica "${incoming.replicaId}" MOVEd node "${nodeKey}" but replica "${prior.replicaId}" had already UPDATEd it. ` +
                    `The MOVE copied pre-update content. UPDATE characters are now orphaned at the old location.`,
                autoRecoverable: true,
                recoverySuggestion: {
                    strategy: AutoRecoveryStrategy.RE_APPLY_UPDATE_AT_NEW_ANCHOR,
                    newAnchorNodeKey: nodeKey,
                },
            };

        // The node was updated, then concurrently deleted by another replica.
        // The UPDATE's characters are now orphaned next to tombstones.
        case "DELETE":
            return {
                type: ConflictType.UPDATE_OF_DELETED_NODE,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replica "${incoming.replicaId}" DELETEd node "${nodeKey}" while replica "${prior.replicaId}" was UPDATEing it. ` +
                    `The updated content is orphaned adjacent to tombstones.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };

        // Prior UPDATE then incoming ADD of same key — shouldn't happen in a
        // well-formed edit script, but guard anyway.
        case "ADD":
            return {
                type: ConflictType.ADD_OF_EXISTING_NODE,
                nodeKey,
                prior,
                incoming,
                desc: `Incoming ADD for node "${nodeKey}" which already exists (was previously UPDATEd). Possible replayed or malformed message.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };
    }
}

/**
 * Classify conflicts where the prior operation was a MOVE. This includes cases like:
 * - Concurrent MOVEs of the same node by different replicas, which results in duplicate content at multiple locations.
 * - UPDATE or DELETE of a node that was concurrently MOVEd, where the UPDATE/DELETE may have read stale content and the MOVE's new location is now the only place the content exists.
 * - ADD of the same node key after a MOVE, which could indicate a replayed or out-of-order message since the node already exists at the new location.
 * - Other edge cases around the timing of when the MOVE was applied relative to the incoming operation.
 * @param nodeKey - The key of the node being operated on
 * @param prior - The history entry of the prior UPDATE operation that was already applied
 * @param incoming - A summary of the incoming operation that is being classified against the prior UPDATE operation
 * @param registryHasNode - Boolean indicating whether the registry currently has an entry for the node key
 */
function classifyAfterMove(
    nodeKey: string,
    prior: NodeHistoryEntry,
    incoming: IncomingOpSummary,
    registryHasNode: boolean,
): Conflict | null {
    switch (incoming.opType) {
        // Two replicas concurrently moved the same node to (potentially different) targets.
        // Both MOVEs applied (insert-first strategy), so the content now exists
        // at TWO locations in the FugueTree.
        case "MOVE":
            return {
                type: ConflictType.CONCURRENT_MOVE_DUPLICATE,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replicas "${prior.replicaId}" and "${incoming.replicaId}" both MOVEd node "${nodeKey}" concurrently. ` +
                    `The content now appears in two locations in the document. Manual resolution is required to remove the duplicate.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };

        // Incoming UPDATE targets the node at its old location (before the MOVE).
        // The UPDATE's characters will land adjacent to tombstones of the old span.
        case "UPDATE":
            return {
                type: ConflictType.UPDATE_ON_STALE_LOCATION,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replica "${incoming.replicaId}" UPDATEd node "${nodeKey}" but replica "${prior.replicaId}" had already MOVEd it. ` +
                    `The UPDATE targeted the old location and its characters are now orphaned adjacent to tombstones.`,
                autoRecoverable: true,
                recoverySuggestion: {
                    strategy: AutoRecoveryStrategy.RE_APPLY_UPDATE_AT_NEW_ANCHOR,
                    newAnchorNodeKey: nodeKey,
                },
            };

        // Node was moved then concurrently deleted by another replica.
        // The DELETE tombstoned the old location, but the MOVE's INSERT copy
        // still exists at the new location. The registry is now inconsistent —
        // it still points to the new location but the "canonical" intent was deletion.
        case "DELETE":
            return {
                type: ConflictType.MOVE_OF_DELETED_NODE,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replica "${incoming.replicaId}" DELETEd node "${nodeKey}" but replica "${prior.replicaId}" had already MOVEd it. ` +
                    `A copy exists at the new location. The registry entry may need to be removed if deletion intent wins.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };

        // ADD after a MOVE of the same key, same as ADD after UPDATE
        case "ADD":
            return {
                type: ConflictType.ADD_OF_EXISTING_NODE,
                nodeKey,
                prior,
                incoming,
                desc: `Incoming ADD for node "${nodeKey}" which already exists (was previously MOVEd). Possible replayed or malformed message.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };
    }
}

/**
 * Classify conflicts where the prior operation was a DELETE. This includes cases like:
 * - UPDATE or MOVE of a node that was concurrently DELETEd, where the UPDATE/MOVE may have read stale content and the DELETE's intent was to remove the node entirely.
 * - ADD of the same node key after a DELETE, which could be a legitimate "resurrection" or could indicate a replayed or out-of-order message.
 * - Two replicas concurrently DELETEing the same node, which is actually idempotent in FugueTree and not a conflict.
 * - Other edge cases around the timing of when the DELETE was applied relative to the incoming operation.
 * @param nodeKey - The key of the node being operated on
 * @param prior - The history entry of the prior DELETE operation that was already applied
 * @param incoming - A summary of the incoming operation that is being classified against the prior DELETE operation
 */
const classifyAfterDelete = (
    nodeKey: string,
    prior: NodeHistoryEntry,
    incoming: IncomingOpSummary,
): Conflict | null => {
    switch (incoming.opType) {
        // Incoming UPDATE on a node that was already deleted.
        case "UPDATE":
            return {
                type: ConflictType.UPDATE_OF_DELETED_NODE,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replica "${incoming.replicaId}" UPDATEd node "${nodeKey}" but replica "${prior.replicaId}" had already DELETEd it. ` +
                    `The UPDATE's characters are orphaned.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };

        // Incoming MOVE on a node that was already deleted.
        // The MOVE's INSERT copy exists at the new location from a "ghost" node.
        case "MOVE":
            return {
                type: ConflictType.MOVE_OF_DELETED_NODE,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Replica "${incoming.replicaId}" MOVEd node "${nodeKey}" but replica "${prior.replicaId}" had already DELETEd it. ` +
                    `The MOVE created a copy of the deleted content at the target location.`,
                autoRecoverable: false,
                recoverySuggestion: { strategy: AutoRecoveryStrategy.NOTIFY_USER },
            };

        // Two replicas deleted the same node — idempotent in FugueTree (tombstoning
        // an already-tombstoned node is a no-op), so this is not actually a conflict.
        case "DELETE":
            return null;

        // ADD after DELETE of the same key — this is a "resurrection".
        // Could be legitimate (user re-adds a removed section) or a bug.
        // We allow it but surface it as a recoverable informational event.
        case "ADD":
            return {
                type: ConflictType.ADD_OF_EXISTING_NODE,
                nodeKey,
                prior,
                incoming,
                desc:
                    `Node "${nodeKey}" was DELETEd by replica "${prior.replicaId}" but is being re-ADDed by replica "${incoming.replicaId}". ` +
                    `This may be intentional (resurrection) or a stale message.`,
                autoRecoverable: true,
                recoverySuggestion: {
                    strategy: AutoRecoveryStrategy.RESTORE_REGISTRY_ENTRY,
                    fromTxId: incoming.txnId,
                },
            };
    }
};
