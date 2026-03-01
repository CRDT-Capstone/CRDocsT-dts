import { FugueMessage, makeFugueMessage, Operation } from "../../types/FugueTree/Message.js";
import { MessageType } from "../../types/Message.js";
import { chunkArray, randomString } from "../../utils/index.js";
import { FugueMessageSerialzier } from "../Serailizers/FugueTree/index.js";
import { Serializer } from "../Serailizers/General.js";
import { FNode, FTree, ID } from "./FTree.js";

/**
 * A Fugue Tree CRDT, with insert and delete operations.
 */
export class FugueTree {
    private counter = 0;
    private tree: FTree;
    ws: WebSocket | null;
    documentID: string;
    readonly replicaID = randomString(3);
    userIdentity: string;
    pendingMsgs = new Map<string, FugueMessage>();
    // Tentative
    readonly batchSize = 800;

    constructor(ws: WebSocket | null, documentID: string, userIdentity: string) {
        this.ws = ws;
        this.documentID = documentID;
        this.userIdentity = userIdentity;
        this.tree = new FTree();
    }

    /**
     * Make msg key for pending messages map
     * @param msg - the message to make key for
     * @returns the key for the message in pending messages map
     */
    private makeMsgKey(msg: FugueMessage): string {
        return `${msg.replicaId}-${msg.id.counter}`;
    }

    /**
     * Propagates message or messages to replicas
     * @param msg - Message or messages to propagate to replicas
     */
    async propagate(msg: FugueMessage | FugueMessage[]) {
        // Batch send messages in the propagate function,
        // since some operations (e.g. paste or delete a large chunk of text) can generate a
        // large number of messages that would be inefficient to send one by one.
        if (!this.ws) return;

        for (const batch of chunkArray(Array.isArray(msg) ? msg : [msg], this.batchSize)) {
            const bytes = Serializer.serialize(batch);
            this.ws.send(bytes);
        }
    }

    /**
     * Inserts a value at the given index and returns the corresponding FugueMessage.
     * @param index - the index to insert the value at
     * @param value - the value to insert
     * @returns the FugueMessage representing the insert operation
     */
    private insertImpl(index: number, value: string): FugueMessage {
        const id = { sender: this.replicaID, counter: this.counter };
        // PERF: optimize by caching the last accessed node and its index,
        // so that if the next insert is nearby, we can start from there instead of the root
        this.counter++;
        const leftOrigin = index === 0 ? this.tree.root : this.tree.getByIndex(this.tree.root, index - 1);

        let msg: FugueMessage;
        if (leftOrigin.rightChildren.length === 0) {
            // leftOrigin has no right children, so the new node becomes
            // a right child of leftOrigin.
            msg = {
                msgType: MessageType.FUGUE,
                userIdentity: this.userIdentity,
                operation: Operation.INSERT,
                id,
                data: value,
                parent: leftOrigin.id,
                side: "R",
                replicaId: this.replicaId(),
                documentID: this.documentID,
            };
            // rightOrigin is the node after leftOrigin in the tree traversal,
            // given that leftOrigin has no right descendants.
            const rightOrigin = this.tree.nextNonDescendant(leftOrigin);
            msg.rightOrigin = rightOrigin === null ? undefined : rightOrigin.id;
        } else {
            // Otherwise, the new node is added as a left child of rightOrigin, which
            // is the next node after leftOrigin including deleted nodes.
            // In this case, rightOrigin is the leftmost descendant of leftOrigin's
            // first right child.
            const rightOrigin = this.tree.leftmostDescendant(leftOrigin.rightChildren[0]);
            msg = {
                msgType: MessageType.FUGUE,
                userIdentity: this.userIdentity,
                operation: Operation.INSERT,
                id,
                data: value,
                parent: rightOrigin.id,
                side: "L",
                replicaId: this.replicaId(),
                documentID: this.documentID,
            };
        }
        msg.userIdentity = this.userIdentity;

        return msg;
    }

    /**
     * Inserts multiple values starting at the given index. This is optimized for batch inserts, such as pasting a large chunk of text.
     * @param index - the index to start inserting values at
     * @param values - the string of values to insert, where each character is inserted as a separate node in the tree
     */
    insertMultiple(index: number, values: string) {
        let msgs: FugueMessage[] = [];
        for (let i = 0; i < values.length; i++) {
            const val = values[i];
            const idx = index + i;
            const msg = this.insertImpl(idx, val);

            this.tree.addNode(msg.id, val, this.tree.getByID(msg.parent!), msg.side, msg.rightOrigin);
            msgs.push(msg);
        }
        return msgs;
    }

    /**
     * Inserts a value at the given index and propagates the corresponding FugueMessage to replicas.
     * @param index -  the index to insert the value at
     * @param value -  the value to insert
     */
    insert(index: number, value: string) {
        const msg = this.insertImpl(index, value);
        this.tree.addNode(msg.id, value, this.tree.getByID(msg.parent!), msg.side, msg.rightOrigin);

        return msg;
    }

    /**
     * Deletes the value at the given index and returns the corresponding FugueMessage.
     * @param index - the index to delete the value at
     * @returns the FugueMessage representing the delete operation
     */
    private deleteImpl(index: number) {
        const node = this.tree.getByIndex(this.tree.root, index);

        if (!node.isDeleted) {
            node.value = null;
            node.isDeleted = true;
            this.tree.updateSize(node, -1);
        }

        const msg: FugueMessage = {
            msgType: MessageType.FUGUE,
            operation: Operation.DELETE,
            documentID: this.documentID,
            replicaId: this.replicaID,
            userIdentity: this.userIdentity,
            id: node.id,
            data: null,
            side: "R",
        };

        return msg;
    }

    /**
     * Deletes multiple values starting at the given index. This is optimized for batch deletes, such as deleting a large chunk of text.
     * @param index - the index to start deleting values at
     * @param length - the number of characters to delete, starting from the index
     */
    deleteMultiple(index: number, length: number) {
        let msgs: FugueMessage[] = [];
        for (let i = 0; i < length; i++) {
            const msg = this.deleteImpl(index);
            msgs.push(msg);
        }

        return msgs;
    }

    /**
     * Deletes the value at the given index and propagates the corresponding FugueMessage to replicas.
     * @param index - the index to delete the value at
     */
    delete(index: number) {
        const msg = this.deleteImpl(index);
        this.propagate(msg);
    }

    /**
     * Applies a FugueMessage to the tree. Returns true if the message was successfully applied,
     * or false if it could not be applied due to missing dependencies (e.g. parent node for an insert).
     * @param msg - the FugueMessage to apply to the tree
     */
    private applyToTree(msg: FugueMessage) {
        const { operation, data, id, parent, side, rightOrigin } = msg;

        switch (operation) {
            case Operation.INSERT:
                try {
                    if (!data) throw Error("Data is required for Operation.INSERT");
                    if (!parent) throw Error("Parent is required for Operation.INSERT");
                    this.tree.addNode(id, data, this.tree.getByID(parent), side, rightOrigin);
                    return true;
                } catch (e) {
                    //console.log('Error from insert -> ', e);
                    return false;
                }
            case Operation.DELETE:
                try {
                    const node = this.tree.getByID(id);
                    if (!node.isDeleted) {
                        node.value = null;
                        node.isDeleted = true;
                        this.tree.updateSize(node, -1);
                    }
                    return true;
                } catch (e) {
                    //console.log('Error from delete -> ', e);
                    return false;
                }
            default:
                throw Error("Invalid operation");
        }
    }

    /**
     * Processes pending messages that may now be applicable after applying new messages.
     * This is called after successfully applying new messages, to check if any pending messages can now be applied due to their dependencies being satisfied.
     * @param applied - the list of messages that were just applied, which may have satisfied dependencies for pending messages
     */
    private processPending(applied: FugueMessage[]) {
        let changed = true;

        // Iteratively try to apply pending messages until no more can be applied
        // This avoids recursion and handles deep causal chains (A -> B -> C)
        while (changed && this.pendingMsgs.size > 0) {
            changed = false;

            for (const [id, msg] of this.pendingMsgs) {
                if (this.applyToTree(msg)) {
                    applied.push(msg);
                    this.pendingMsgs.delete(id);
                    changed = true;
                }
            }
        }
    }

    /**
     * Applies effect messages to the list
     * @param msg - Message or messages to apply effect for, can be batched
     * @returns the list of messages that were successfully applied
     */
    effect(msg: FugueMessage | FugueMessage[]): FugueMessage[] {
        const applied: FugueMessage[] = [];
        const msgs = Array.isArray(msg) ? msg : [msg];
        for (const msg of msgs) {
            // Skip messages from this replica
            if (msg.replicaId === this.replicaId()) continue;

            const succ = this.applyToTree(msg);
            if (succ) {
                applied.push(msg);
            } else {
                // Deduplication of pending messages
                if (!this.pendingMsgs.has(this.makeMsgKey(msg))) this.pendingMsgs.set(this.makeMsgKey(msg), msg);
            }
        }

        if (applied.length > 0) {
            this.processPending(applied);
        }

        return applied;
    }

    /**
     * Gets the value at the given index in the visible string.
     * @param index - the index to get the value at, where the index is based on the visible string
     * @returns the value at the given index in the visible string
     */
    get(index: number): string {
        if (index < 0 || index >= this.length()) {
            throw new Error("Index out of bounds");
        }

        const node = this.tree.getByIndex(this.tree.root, index);
        return node.value!;
    }

    /**
     * Gets the length of the visible string, which is the number of non-deleted nodes in the tree.
     * @returns the length of the visible string
     */
    length(): number {
        return this.tree.root.size;
    }

    /**
     * Returns the visible string by traversing the tree and concatenating the values of non-deleted nodes.
     * @returns the visible string represented by the tree, which is the concatenation of values of non-deleted nodes in traversal order
     */
    observe(): string {
        // PERF: find a way to just use the iterator without concatenating the whole string,
        // since that can be expensive for large documents and we may only need to observe a
        // portion of the document at a time (e.g. for rendering a viewport).
        let res = "";
        for (const t of this.tree.traverse(this.tree.root)) {
            res += t;
        }
        return res;
    }

    traverse() {
        return this.tree.traverse(this.tree.root);
    }

    /**
     * Serializes the tree into a Uint8Array.
     * @returns a Uint8Array representing the serialized tree.
     */
    save(): Uint8Array {
        const bytes = this.tree.save();
        return bytes;
    }

    /**
     * Loads the tree from a Uint8Array. This replaces the current tree with the loaded tree.
     * @param data - a Uint8Array representing the serialized tree to load.
     */
    load(data: Uint8Array | null) {
        if (!data) return;
        this.tree.load(data);
    }

    /**
     * Gets the replica ID of this FugueTree instance, which is a unique identifier for this replica in the distributed system.
     * The replica ID is used in messages to identify the source of operations and to ensure that operations from the same replica
     * are applied in order.
     * @returns
     */
    replicaId(): string {
        return this.replicaID;
    }

    /**
     * Gets the FNode corresponding to the given ID.
     * @param id - the ID of the node to retrieve
     * @returns the FNode corresponding to the given ID, or null if no such node exists in the tree
     */
    getById(id: ID) {
        return this.tree.getByID(id);
    }

    /**
     * Gets the index of the given node in the visible string.
     * @param node - the FNode to get the visible index of
     * @returns the index of the given node in the visible string
     */
    getVisibleIndex(node: FNode) {
        return this.tree.getVisibleIndex(node);
    }

    getState() {
        return this.tree;
    }

    clear() {
        return this.tree.clear();
    }

    /**
     * Get the next non-descendant of a node, i.e. the node corresponding to the next non-deleted character in document order
     * that is not in the subtree rooted at the given node.
     * @param node - the node whose next non-descendant to find
     * @returns the next non-descendant of the given node, or null if there is no such node (i.e. the given node is the last non-deleted character in document order)
     */
    nextNonDescendant(node: FNode) {
        return this.tree.nextNonDescendant(node);
    }
}
