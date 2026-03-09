import type { AstNode, BragiAST, NodeId } from "../../types/index.js";
import { MappingStore } from "../../types/GumTree.js";
import { type Action, Delete, Insert, TreeDelete, TreeInsert, Update, Move } from "../Model/index.js";
import { ChawatheScriptGen } from "./ChawatheScriptGen.js";
import { type EditScript, type EditScriptGen, lastIndexOf } from "./EditScriptGen.js";
import { logger } from "../../../utils/logging.js";

export class SimplifiedChawatheScriptGen implements EditScriptGen {
    computeActions(ms: MappingStore): EditScript {
        const actions = new ChawatheScriptGen().computeActions(ms);
        logger.debug("Unsimplified", { unsimplified: actions });
        return this.simplify(actions, ms.newAst, ms.oldAst);
    }

    private simplify(actions: EditScript, dst: BragiAST, src: BragiAST): EditScript {
        // Build node → action maps, keyed by node id (equivalent to Java's Tree identity)
        const addedTrees = new Map<NodeId, Insert>();
        const deletedTrees = new Map<NodeId, Delete>();

        for (const a of actions) {
            if (a instanceof Insert) addedTrees.set(a.node.id, a);
            else if (a instanceof Delete) deletedTrees.set(a.node.id, a);
        }

        // --- Process insertions ---
        for (const [tId, action] of addedTrees) {
            const t = action.node;

            // Java: addedTrees.keySet().contains(t.getParent())
            //       && addedTrees.keySet().containsAll(t.getParent().getDescendants())
            // i.e. the parent is also being inserted AND all of the parent's descendants are inserted
            const parentId = t.parentId;
            if (
                parentId !== null &&
                addedTrees.has(parentId) &&
                this.allDescendantsInserted(parentId, addedTrees, dst)
            ) {
                // Interior node of a fully-inserted subtree — remove
                const idx = lastIndexOf(actions, action);
                if (idx !== -1) actions.splice(idx, 1);
            } else {
                // Java: t.getChildren().size() > 0
                //       && addedTrees.keySet().containsAll(t.getDescendants())
                // i.e. t has children and ALL of t's descendants are inserted → promote to TreeInsert
                if (t.childrenIds.length > 0 && this.allDescendantsInserted(tId, addedTrees, dst)) {
                    const ti = new TreeInsert(action.node, action.parent, action.pos);
                    // Java: actions.add(index, ti); actions.remove(index + 1)
                    // i.e. replace in place at the original position
                    const idx = lastIndexOf(actions, action);
                    if (idx !== -1) actions.splice(idx, 1, ti);
                }
            }
        }

        // --- Process deletions ---
        for (const [tId, action] of deletedTrees) {
            const t = action.node;

            // Java: deletedTrees.keySet().contains(t.getParent())
            //       && deletedTrees.keySet().containsAll(t.getParent().getDescendants())
            const parentId = t.parentId;
            if (parentId !== null && deletedTrees.has(parentId) && this.allDescendantsDeleted(parentId, deletedTrees)) {
                // Interior node of a fully-deleted subtree — remove
                const idx = lastIndexOf(actions, action);
                if (idx !== -1) actions.splice(idx, 1);
            } else {
                // Java: t.getChildren().size() > 0
                //       && deletedTrees.keySet().containsAll(t.getDescendants())
                if (t.childrenIds.length > 0 && this.allDescendantsDeleted(tId, deletedTrees)) {
                    const td = new TreeDelete(action.node);
                    const idx = lastIndexOf(actions, action);
                    if (idx !== -1) actions.splice(idx, 1, td);
                }
            }
        }

        // Java version does not sort — it preserves the order ChawatheScriptGen produced.
        // The Chawathe BFS guarantees Updates/Moves come before Inserts/Deletes naturally.
        return actions;
    }

    /**
     * Equivalent to Java's addedTrees.keySet().containsAll(t.getDescendants()).
     * Returns true if every descendant of nodeId in dst is present in addedTrees.
     */
    private allDescendantsInserted(nodeId: NodeId, addedTrees: Map<NodeId, Insert>, dst: BragiAST): boolean {
        const node = dst.nodes.get(nodeId);
        if (!node) return false;
        for (const childId of node.childrenIds) {
            if (!addedTrees.has(childId)) return false;
            if (!this.allDescendantsInserted(childId, addedTrees, dst)) return false;
        }
        return true;
    }

    /**
     * Equivalent to Java's deletedTrees.keySet().containsAll(t.getDescendants()).
     * Uses deleted node's own childrenIds to walk descendants since src working copy
     * has been mutated by ChawatheScriptGen.
     */
    private allDescendantsDeleted(nodeId: NodeId, deletedTrees: Map<NodeId, Delete>): boolean {
        const action = deletedTrees.get(nodeId);
        if (!action) return false;
        for (const childId of action.node.childrenIds) {
            if (!deletedTrees.has(childId)) return false;
            if (!this.allDescendantsDeleted(childId, deletedTrees)) return false;
        }
        return true;
    }
}
