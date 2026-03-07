import { Tree } from "web-tree-sitter";
import { FNode, FugueTree } from "../../../dts/index.js";
import { FugueMessage } from "../../../types/index.js";
import { logger } from "../../../utils/logging.js";
import { EditScript } from "../../Actions/EditScript/EditScriptGen.js";
import {
    Action,
    Actions,
    ActionType,
    Delete,
    Move,
    OperationPart,
    OperationType,
    TreeInsert,
    Update,
} from "../../Actions/Model/Action.js";
import { AstNode, BragiAST } from "../../types/index.js";
import { Anchor, Registry } from "../Registry/index.js";

/**
 * Translates the EditScript tree level actions into FugueTree operations, i.e. some combination of insert and deletion operations.
 * The name Ratatoskr is inspired by the mythological Norse squirrel who runs up and down the world tree Yggdrasil, carrying messages
 * between the eagle at the top and the serpent Niðhoggr at the bottom.
 * In our case, Ratatoskr is responsible for carrying/translating the messages of changes represented by the EditScript actions down
 * to Nidhoggr, fugue operation effector, which will apply the recevied translated operations to remote replicas, i.e. gnawing at the
 * proverbial roots of the tree.
 */
export class Ratatoskr {
    registry: Registry;
    fugue: FugueTree;
    pastActions: { timestamp: number; editScript: EditScript }[] = [];
    newAst?: BragiAST;

    constructor(fugue: FugueTree, registry: Registry, newAst?: BragiAST) {
        this.fugue = fugue;
        this.registry = registry;
        this.newAst = newAst;
    }

    /**
     * Translate the EditScript generated from EditScriptGen into a series of fugue operations applied to the FugueTree, and return the corresponding FugueMessages to be sent to clients.
     * @param editScript - The EditScript generated from EditScriptGen, representing the minimum set of actions needed to transform the old AST into the new AST
     * @returns  An array of FugueMessages representing the operations needed to transform the FugueTree to reflect the changes in the EditScript
     * TODO: Look into rollback in the case where this change would cause a syntax error, possibly by generating
     * the CST again with treesitter and check for errors before applying the change to the FugueTree
     */
    translate(editScript: EditScript): FugueMessage[] {
        if (!this.newAst) return [];
        // Log the edit script with a timestamp for debugging and potential future use, i.e. rollback or conflict resolution
        this.pastActions.push({ timestamp: Date.now(), editScript });
        const msgs: FugueMessage[] = [];
        const txId = `tx-${crypto.randomUUID()}`;

        // Iterate through the edit script and translate apply the actions to the FugueTree, returning the corresponding FugueMessages
        for (const action of editScript) {
            let actionMsgs: FugueMessage[] = [];

            switch (action.type) {
                // Tree insert and regular insert are handled the same way because we are treating the inserted content as a flat string, so we
                // don't need to worry about the tree structure of the inserted content in the FugueTree, we just need to insert the combined text
                // content of the inserted node and its children at the correct position in the FugueTree
                case ActionType.TREE_INSERT:
                case ActionType.INSERT:
                    actionMsgs = this.handleInsert(action as TreeInsert, txId);
                    break;

                // The same goes for delete and tree delete.
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
        const text = this.serializeNode(action.node);
        const msgs = this.fugue.insertMultiple(action.pos, text);
        logger.debug({ text, state: this.fugue.observe() }, "Handling insert for node", action.node.id);

        this.tag(msgs, txId, action.node.id, "ADD");

        // Register the new node in the registry for reference in fugure operations.
        this.registry.register(action.node.id, {
            startId: msgs[0].id,
            length: text.length,
        });

        this.registerSubtree(action.node, msgs, 0);

        return msgs;
    }

    private registerSubtree(node: AstNode, msgs: FugueMessage[], offset: number): number {
        if (!node.childrenIds || node.childrenIds.length === 0) {
            const len = node.text?.length ?? 0;
            if (len > 0 && !this.registry.has(node.id)) {
                this.registry.register(node.id, {
                    startId: msgs[offset].id,
                    length: len,
                });
            }
            return len;
        }

        const startOffset = offset;
        let currentOffset = offset;
        for (const childId of node.childrenIds) {
            const child = this.newAst!.nodes.get(childId)!;
            currentOffset += this.registerSubtree(child, msgs, currentOffset);
        }

        if (!this.registry.has(node.id) && currentOffset > startOffset) {
            this.registry.register(node.id, {
                startId: msgs[startOffset].id,
                length: currentOffset - startOffset,
            });
        }

        return currentOffset - startOffset;
    }

    /**
     * Handle translation of a Move action into fugue operations and corresponding FugueMessages.
     * @param action - The Move action to be translated
     * @param txId - The transaction ID for tagging the resulting FugueMessages
     * @returns An array of FugueMessages resulting from the translation of the Move action
     */
    private handleMove(action: Move, txId: string): FugueMessage[] {
        logger.debug("Handling move for node", action.node.id, { registry: this.registry });
        // Retrieve the current anchor for the node being moved, and the text content of the span being moved.
        // this assumes that the span being moved exists in the registry.
        const anchor = this.registry.get(action.node.id);
        if (!anchor) throw new Error("Move target not in registry");

        const content = this.getSpanText(anchor);

        // If there is no content to move, we can skip the operation
        if (content.length === 0) return [];

        // To prevent loss of content during move, we perform the insert operation before the delete operation
        // we essentially treat the move as a copy of the existing content to the new location, followed by a deletion of the old content

        const insMsgs = this.fugue.insertMultiple(action.pos, content);
        this.tag(insMsgs, txId, action.node.id, "MOVE", "INSERT");

        // If there are no insert message it means the insert operation did not actually insert any content
        // if this happens we passed the content length check above though so I don't think should be possible
        if (insMsgs.length === 0)
            throw new Error(
                `No insert messages generate for action ${action.node.id}, even though content length is ${content.length}`,
            );

        // Find the index of the first node being moved, and delete the span being moved from its original location
        const srcTdx = this.fugue.getVisibleIndex(this.fugue.getById(anchor.startId));
        const delMsgs = this.fugue.deleteMultiple(srcTdx, anchor.length);
        this.tag(delMsgs, txId, action.node.id, "MOVE", "DELETE");

        // Determine the expected number of insert and delete messages to be generated for this move operation, used
        // by remote replicas to verify that they have received all the messages for this operation before applying them
        const expectedInsert = insMsgs.length;
        const expectedDelete = delMsgs.length;
        const all = [...insMsgs, ...delMsgs];
        all.forEach((m) => {
            m.coastExpectedInsertCount = expectedInsert;
            m.coastExpectedDeleteCount = expectedDelete;
        });

        // Update Registry to new anchor
        this.registry.update(action.node.id, { startId: insMsgs[0].id });

        return all;
    }

    /**
     * Handle translation of a Delete action into fugue operations and corresponding FugueMessages.
     * @param action - The Delete action to be translated
     * @param txId - The transaction ID for tagging the resulting FugueMessages
     * @returns An array of FugueMessages resulting from the translation of the Delete action
     */
    private handleDelete(action: Delete, txId: string): FugueMessage[] {
        logger.debug("Handling delete for node", action.node.id, { registry: this.registry });
        const anchor = this.registry.get(action.node.id);
        if (!anchor) throw new Error(`Delete target ${action.node.id} not in registry`);

        const idx = this.fugue.getVisibleIndex(this.fugue.getById(anchor.startId));
        const msgs = this.fugue.deleteMultiple(idx, anchor.length);

        this.tag(msgs, txId, action.node.id, "DELETE");
        this.registry.delete(action.node.id);

        return msgs;
    }

    /**
     * Handle translation of an Update action into fugue operations and corresponding FugueMessages.
     * @param action - The Update action to be translated
     * @param txId -  The transaction ID for tagging the resulting FugueMessages
     * @returns  An array of FugueMessages resulting from the translation of the Update action
     */
    private handleUpdate(action: Update, txId: string): FugueMessage[] {
        logger.debug({ registry: this.registry }, "Registry before update for node", action.node.id);

        // An update is treated as a deletion of the old content and an insertion of the new content.
        // This bypasses the problems of move operation because we are not trying to preserve the deleted content, so we can
        // perform the delete, without worrying about the lost content, then the insert operation
        const anchor = this.registry.get(action.node.id);
        if (!anchor) {
            throw new Error(`Update target ${action.node.id} not in registry`);
        }

        const content = this.getSpanText(anchor);
        const msgs: FugueMessage[] = [];

        // If the content is the same, we can skip the update
        if (content === action.value) return msgs;

        const idx = this.fugue.getVisibleIndex(this.fugue.getById(anchor.startId));
        const delMsgs = this.fugue.deleteMultiple(idx, anchor.length);
        this.tag(delMsgs, txId, action.node.id, "UPDATE", "DELETE");

        const insMsgs = this.fugue.insertMultiple(
            idx,
            Array.isArray(action.value) ? action.value.join("") : action.value,
        );
        this.tag(insMsgs, txId, action.node.id, "UPDATE", "INSERT");

        const expectedInsert = insMsgs.length;
        const expectedDelete = delMsgs.length;
        const all = [...insMsgs, ...delMsgs];
        all.forEach((m) => {
            m.coastExpectedInsertCount = expectedInsert;
            m.coastExpectedDeleteCount = expectedDelete;
        });

        this.registry.update(action.node.id, { startId: insMsgs[0].id, length: action.value.length });

        if (action.newNode.id !== action.node.id) {
            this.registry.register(action.newNode.id, {
                startId: insMsgs[0].id,
                length: typeof action.value === "string" ? action.value.length : action.value.join("").length,
            });
        }

        return all;
    }

    /**
     * Tag FugueMessages with metadata for tracking and remote application on replicas.
     * This metadata allows remote replicas to group messages by their txIds and actions and apply them in the correct order.
     * @param msgs - The FugueMessages to be tagged with metadata
     * @param txId - The transaction ID to group related messages together, i.e. all messages resulting from the same EditScript action should have the same txId
     * @param key - The key of the node in the AST that this message is related to, i.e. the node being inserted, deleted, moved, or updated
     * @param type - The type of operation this message is part of, i.e. "ADD", "DELETE", "MOVE", or "UPDATE"
     * @param part - An optional parameter to specify the part of the operation this message is related to,
        for example for a move operation, whether this message is part of the "INSERT" or "DELETE" phase of the move
     */
    private tag(msgs: FugueMessage[], txId: string, key: string, type: OperationType, part?: OperationPart) {
        msgs.forEach((m) => {
            m.coastTxId = txId;
            m.coastNodeKey = key;
            m.coastOpType = type;
            if (part) m.coastOpPart = part;
        });
    }

    /**
     * Recursively serialize the text content of an AstNode and its children into a single string, using preorder traversal of the AST.
     * @param node - The AstNode to be serialized, which may contain text content and/or child nodes with their own text content
     * @returns A string representing the combined text content of the node and all of its descendants in the AST
     */
    private serializeNode(node: AstNode): string {
        let result = "";

        if (!node.childrenIds || node.childrenIds.length === 0) {
            if (node.text) {
                result += Array.isArray(node.text) ? node.text.join("") : node.text;
            }
            return result;
        }

        for (const childId of node.childrenIds) {
            const childNode = this.newAst!.nodes.get(childId);
            if (childNode) {
                result += this.serializeNode(childNode);
            }
        }

        return result;
    }

    /**
     * Given an anchor representing a span of text in the FugueTree, retrieve the current text content of that span by traversing the
     * FugueTree starting from the anchor's startId and concatenating the values of the nodes in that span.
     * @param anchor - The Anchor representing the span of text to retrieve from the FugueTree
     * @returns A string representing the current text content of the span defined by the anchor in the FugueTree
     */
    private getSpanText(anchor: Anchor): string {
        let text = "";
        let currentNode: FNode | null = this.fugue.getById(anchor.startId);

        for (let i = 0; i < anchor.length; i++) {
            if (!currentNode) break;

            if (!currentNode.isDeleted && currentNode.value !== null) {
                text += currentNode.value;
            } else {
                // If the current node is deleted or has no value, we need to skip it and move to the next non-deleted node in the FugueTree.
                i--;
            }

            // Move to the next node in the FugueTree as dictated by the nextNonDescendant function, which will skip over any deleted nodes and their descendants.
            currentNode = this.fugue.nextNonDescendant(currentNode);
        }

        return text;
    }
}
