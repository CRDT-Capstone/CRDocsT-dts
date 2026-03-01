import type { BragiAST, NodeId } from "../../types";
import { MappingStore } from "../../types/GumTree";
import { type Action, Delete, Insert, TreeDelete, TreeInsert } from "../Model/index.js";
import { ChawatheScriptGen } from "./ChawatheScriptGen";
import { type EditScript, type EditScriptGen, lastIndexOf } from "./EditScriptGen";

export class SimplifiedChawatheScriptGen implements EditScriptGen {
    computeActions(ms: MappingStore): EditScript {
        const actions = new ChawatheScriptGen().computeActions(ms);
        return this.simplify(actions, ms.newAst);
    }

    private simplify(actions: EditScript, dst: BragiAST): EditScript {
        const insertedNodes = new Map<NodeId, Insert>();
        const deletedNodes = new Map<NodeId, Delete>();

        for (const action of actions) {
            if (action instanceof Insert) insertedNodes.set(action.node.id, action);
            else if (action instanceof Delete) deletedNodes.set(action.node.id, action);
        }

        const insertReplacements = new Map<Insert, TreeInsert | null>(); // null = remove

        for (const [, action] of insertedNodes) {
            const t = action.node;
            const parentInserted =
                insertedNodes.has(t.parentId!) && this.allDescendantsInserted(t.parentId!, insertedNodes, dst);

            if (parentInserted) {
                insertReplacements.set(action, null);
            } else {
                const allDescendantsInserted =
                    t.childrenIds.length > 0 && this.allDescendantsInserted(t.id, insertedNodes, dst);

                if (allDescendantsInserted) {
                    insertReplacements.set(action, new TreeInsert(action.node, action.parent, action.pos));
                }
            }
        }

        const deleteReplacements = new Map<Delete, TreeDelete | null>();

        for (const [, action] of deletedNodes) {
            const t = action.node;
            const parentDeleted =
                t.parentId !== null &&
                deletedNodes.has(t.parentId) &&
                this.allDescendantsDeleted(t.parentId!, deletedNodes);

            if (parentDeleted) {
                // Interior node of a fully-deleted subtree — remove.
                deleteReplacements.set(action, null);
            } else {
                const allDescendantsDeleted =
                    t.childrenIds.length > 0 && this.allDescendantsDeleted(t.id, deletedNodes);

                if (allDescendantsDeleted) {
                    // Subtree root — promote to TreeDelete.
                    deleteReplacements.set(action, new TreeDelete(action.node));
                }
            }
        }

        const applyReplacements = <T extends Action>(replacements: Map<T, Action | null>) => {
            // Sort by descending index so splices don't invalidate earlier positions.
            const sorted = [...replacements.entries()].sort(
                ([a], [b]) => lastIndexOf(actions, b) - lastIndexOf(actions, a),
            );

            for (const [original, replacement] of sorted) {
                const idx = lastIndexOf(actions, original);
                if (idx === -1) continue;
                if (replacement === null) {
                    actions.splice(idx, 1);
                } else {
                    actions.splice(idx, 1, replacement);
                }
            }
        };

        applyReplacements(insertReplacements);
        applyReplacements(deleteReplacements);

        return actions;
    }

    /**
     * Returns true if every descendant of nodeId, in the dst tree, is present
     * in insertedNodes. Uses the dst BragiAST to walk descendants.
     */
    private allDescendantsInserted(nodeId: NodeId, insertedNodes: Map<NodeId, Insert>, dst: BragiAST): boolean {
        const node = dst.nodes.get(nodeId);
        if (!node) return false;
        for (const childId of node.childrenIds) {
            if (!insertedNodes.has(childId)) return false;
            if (!this.allDescendantsInserted(childId, insertedNodes, dst)) return false;
        }
        return true;
    }

    /**
     * Returns true if every descendant of nodeId is present in deletedNodes.
     * Uses the deleted nodes themselves to walk descendants, because the
     * src working copy has been mutated by ChawatheScriptGen — but every
     * deleted node carries its original childrenIds from ogOldAst.
     */
    private allDescendantsDeleted(nodeId: NodeId, deletedNodes: Map<NodeId, Delete>): boolean {
        const action = deletedNodes.get(nodeId);
        if (!action) return false;
        for (const childId of action.node.childrenIds) {
            if (!deletedNodes.has(childId)) return false;
            if (!this.allDescendantsDeleted(childId, deletedNodes)) return false;
        }
        return true;
    }
}
