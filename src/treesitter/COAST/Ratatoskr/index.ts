import { FNode, FugueTree } from "../../../dts/index.js";
import { FugueMessage } from "../../../types";
import { EditScript } from "../../Actions/EditScript/EditScriptGen.js";
import { Action, Actions, ActionType, Delete, Move, TreeInsert, Update } from "../../Actions/Model/Action.js";
import { AstNode, BragiAST } from "../../types";
import { Anchor, Registry } from "../Registry/index.js";

/**
 *  Translates the EditScript tree level actions into FugueTree operations, i.e. some combination of insert and deletion operations.
 */
export class Ratatoskr {
    registry: Registry = new Registry();
    fugue: FugueTree;
    pastActions: { timestamp: number; editScript: EditScript }[] = [];
    newAst: BragiAST;

    constructor(fugue: FugueTree, newAst: BragiAST) {
        this.fugue = fugue;
        this.newAst = newAst;
    }

    translate(editScript: EditScript): FugueMessage[] {
        // Log the edit script with a timestamp for debugging and potential future use, i.e. rollback or conflict resolution
        this.pastActions.push({ timestamp: Date.now(), editScript });
        const msgs: FugueMessage[] = [];
        const txId = `tx-${crypto.randomUUID()}`;

        // Iterate through the edit script and translate apply the actions to the FugueTree, returning the corresponding FugueMessages
        for (const action of editScript) {
            let actionMsgs: FugueMessage[] = [];

            switch (action.type) {
                case ActionType.TREE_INSERT:
                case ActionType.INSERT:
                    actionMsgs = this.handleInsert(action as TreeInsert, txId);
                    break;

                case ActionType.DELETE:
                case ActionType.TREE_DELETE:
                    actionMsgs = this.handleDelete(action as Delete, txId);
                    break;

                case ActionType.MOVE:
                    actionMsgs = this.handleMove(action as Move, txId);
                    break;

                case ActionType.UPDATE:
                    actionMsgs = this.handleUpdate(action as Update, txId);
                    break;
            }

            msgs.push(...actionMsgs);
        }

        return msgs;
    }

    /**
     * Handle translation of a TreeInsert action into fugue operations and corresponding FugueMessages.
     * @param action - The TreeInsert action to be translated
     * @param txId - The transaction ID for tagging the resulting FugueMessages
     * @returns  An array of FugueMessages resulting from the translation of the TreeInsert action
     */
    private handleInsert(action: TreeInsert, txId: string): FugueMessage[] {
        // Get the text content of the node being inserted, and perform an insertion opertion on the FugueTree
        // TODO: Look into rollback in the case where this change would cause a syntax error, possibly by generating
        // the CST again with treesitter and check for errors before applying the change to the FugueTree
        const text = this.serializeNode(action.node);
        const msgs = this.fugue.insertMultiple(action.pos, text);

        this.tag(msgs, txId, action.node.id, "ADD");

        // Register the new node in the registry for reference in fugure operations.
        this.registry.register(action.node.id, {
            startId: msgs[0].id,
            length: text.length,
        });

        return msgs;
    }

    /**
     * Handle translation of a Move action into fugue operations and corresponding FugueMessages.
     * @param action - The Move action to be translated
     * @param txId - The transaction ID for tagging the resulting FugueMessages
     * @returns An array of FugueMessages resulting from the translation of the Move action
     */
    private handleMove(action: Move, txId: string): FugueMessage[] {
        // Retrieve the current anchor for the node being moved, and the text content of the span being moved.
        // this assumes that the span being moved exists in the registry.
        const anchor = this.registry.get(action.node.id);
        if (!anchor) throw new Error("Move target not in registry");

        const content = this.getSpanText(anchor);

        // To prevent loss of content during move, we perform the insert operation before the delete operation
        // we essentially treat the move as a copy of the existing content to the new location, followed by a deletion of the old content

        const insMsgs = this.fugue.insertMultiple(action.pos, content);
        this.tag(insMsgs, txId, action.node.id, "MOVE", "INSERT");

        // Find the index of the first node being moved, and delete the span being moved from its original location
        const sourceIdx = this.fugue.getVisibleIndex(this.fugue.getById(anchor.startId));
        const delMsgs = this.fugue.deleteMultiple(sourceIdx, anchor.length);
        this.tag(delMsgs, txId, action.node.id, "MOVE", "DELETE");

        // Update Registry to new anchor
        this.registry.update(action.node.id, { startId: insMsgs[0].id });

        return [...insMsgs, ...delMsgs];
    }

    private handleDelete(action: Delete, txId: string): FugueMessage[] {
        const anchor = this.registry.get(action.node.id);
        if (!anchor) return [];

        const idx = this.fugue.getVisibleIndex(this.fugue.getById(anchor.startId));
        const msgs = this.fugue.deleteMultiple(idx, anchor.length);

        this.tag(msgs, txId, action.node.id, "DELETE");
        this.registry.delete(action.node.id);

        return msgs;
    }

    private handleUpdate(action: Update, txId: string): FugueMessage[] {
        const anchor = this.registry.get(action.node.id);
        if (!anchor) throw new Error("Update target not in registry");

        const content = this.getSpanText(anchor);
        const msgs: FugueMessage[] = [];

        // If the content is the same, we can skip the update
        if (content === action.value) return msgs;

        // Otherwise, we need to delete the old content and insert the new content
        const idx = this.fugue.getVisibleIndex(this.fugue.getById(anchor.startId));
        const delMsgs = this.fugue.deleteMultiple(idx, anchor.length);
        this.tag(delMsgs, txId, action.node.id, "UPDATE", "DELETE");

        const insMsgs = this.fugue.insertMultiple(
            idx,
            Array.isArray(action.value) ? action.value.join("") : action.value,
        );
        this.tag(insMsgs, txId, action.node.id, "UPDATE", "INSERT");

        // Update Registry to new anchor
        this.registry.update(action.node.id, { startId: insMsgs[0].id, length: action.value.length });

        return [...delMsgs, ...insMsgs];
    }

    private tag(msgs: FugueMessage[], txId: string, key: string, type: string, part?: string) {
        msgs.forEach((m) => {
            m.coastTxId = txId;
            m.coastNodeKey = key;
            m.coastOpType = type;
            if (part) m.coastOpPart = part;
        });
    }

    private serializeNode(node: AstNode): string {
        let result = "";

        if (node.text) {
            if (Array.isArray(node.text)) {
                result += node.text.join("");
            } else {
                result += node.text;
            }
        }

        if (node.childrenIds && node.childrenIds.length > 0) {
            for (const childId of node.childrenIds) {
                const childNode = this.newAst.nodes.get(childId);
                if (childNode) {
                    result += this.serializeNode(childNode);
                }
            }
        }

        if (node.type === "text" && node.word) {
            for (const wordId of node.word) {
                const wordNode = this.newAst.nodes.get(wordId);
                if (wordNode) {
                    result += this.serializeNode(wordNode);
                }
            }
        }

        return result;
    }

    private getSpanText(anchor: Anchor): string {
        let text = "";
        let currentNode: FNode | null = this.fugue.getById(anchor.startId);

        for (let i = 0; i < anchor.length; i++) {
            if (!currentNode) break;

            if (!currentNode.isDeleted && currentNode.value !== null) {
                text += currentNode.value;
            } else {
                i--;
            }

            currentNode = this.fugue.nextNonDescendant(currentNode);
        }

        return text;
    }
}
