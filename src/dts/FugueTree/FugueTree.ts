import { FugueMessage, Operation } from "../../types/FugueTree/Message.js";
import { randomString } from "../../utils/index.js";
import { FugueMessageSerialzier } from "../Serailizers/FugueTree/index.js";
import { FNode, FTree, ID } from "./FTree.js";

export class FugueTree {
    private counter = 0;
    private tree: FTree;
    ws: WebSocket | null;
    documentID: string; //documentID consistent with the database documentID
    readonly replicaID = randomString(3);
    userIdentity: string | undefined;
    pendingMsgs = new Map<string, FugueMessage>();
    readonly batchSize = 100;

    constructor(ws: WebSocket | null, documentID: string, userIdentity?: string) {
        this.ws = ws;
        this.documentID = documentID;
        this.userIdentity = userIdentity;
        this.tree = new FTree();
    }

    private makeMsgKey(msg: FugueMessage): string {
        return `${msg.replicaId}-${msg.id.counter}`;
    }

    /**
     * Propagates message or messages to replicas
     * @param msg - Message or messages to propagate to replicas
     */
    private propagate(msg: FugueMessage | FugueMessage[]) {
        if (!this.ws) return;

        const allMsgs = Array.isArray(msg) ? msg : [msg];
        const serializedFugueMsg = FugueMessageSerialzier.serialize(allMsgs);
        this.ws.send(serializedFugueMsg);
    }

    private insertImpl(index: number, value: string) {
        const id = { sender: this.replicaID, counter: this.counter };
        this.counter++;
        const leftOrigin = index === 0 ? this.tree.root : this.tree.getByIndex(this.tree.root, index - 1);

        let msg: FugueMessage;
        if (leftOrigin.rightChildren.length === 0) {
            // leftOrigin has no right children, so the new node becomes
            // a right child of leftOrigin.
            msg = {
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
            // is the next node after leftOrigin *including tombstones*.
            // In this case, rightOrigin is the leftmost descendant of leftOrigin's
            // first right child.
            const rightOrigin = this.tree.leftmostDescendant(leftOrigin.rightChildren[0]);
            msg = {
                operation: Operation.INSERT,
                id,
                data: value,
                parent: rightOrigin.id,
                side: "L",
                replicaId: this.replicaId(),
                documentID: this.documentID,
            };
        }

        return msg;
    }

    insertMultiple(index: number, values: string) {
        let msgs: FugueMessage[] = [];
        for (let i = 0; i < values.length; i++) {
            const val = values[i];
            const idx = index + i;
            const msg = this.insertImpl(idx, val);

            this.tree.addNode(msg.id, val, this.tree.getByID(msg.parent!), msg.side, msg.rightOrigin);
            msgs.push(msg);

            if (msgs.length >= this.batchSize) {
                this.propagate(msgs);
                msgs = [];
            }
        }

        if (msgs.length > 0) {
            this.propagate(msgs);
            msgs = [];
        }
    }

    insert(index: number, value: string) {
        const msg = this.insertImpl(index, value);
        this.tree.addNode(msg.id, value, this.tree.getByID(msg.parent!), msg.side, msg.rightOrigin);

        this.propagate(msg);
    }

    private deleteImpl(index: number) {
        const node = this.tree.getByIndex(this.tree.root, index);

        if (!node.isDeleted) {
            node.value = null;
            node.isDeleted = true;
            this.tree.updateSize(node, -1);
        }

        const msg: FugueMessage = {
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

    deleteMultiple(index: number, length: number) {
        let msgs: FugueMessage[] = [];
        for (let i = 0; i < length; i++) {
            const msg = this.deleteImpl(index);
            msgs.push(msg);

            if (msgs.length >= this.batchSize) {
                this.propagate(msgs);
                msgs = [];
            }
        }

        if (msgs.length > 0) {
            this.propagate(msgs);
            msgs = [];
        }
    }

    delete(index: number) {
        const msg = this.deleteImpl(index);
        this.propagate(msg);
    }

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
                    return false;
                }
            default:
                throw Error("Invalid operation");
        }
    }

    private processPending(applied: FugueMessage[]) {
        let changed = true;

        // Iteratively try to apply pending messages until no more can be applied
        // This avoids recursion and handles deep causal chains (A -> B -> C)
        while (changed && this.pendingMsgs.size > 0) {
            changed = false;

            for (const [id, msg] of this.pendingMsgs) {
                // Use applyToTree directly to avoid triggering processPending recursively
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
     */
    effect(msg: FugueMessage | FugueMessage[]) {
        const applied: FugueMessage[] = [];
        const msgs = Array.isArray(msg) ? msg : [msg];
        for (const msg of msgs) {
            // Skip messages from this replica
            if (msg.replicaId == this.replicaId()) continue;

            const succ = this.applyToTree(msg);
            if (succ) {
                applied.push(msg);
            } else {
                // Deduplication
                if (!this.pendingMsgs.has(this.makeMsgKey(msg))) this.pendingMsgs.set(this.makeMsgKey(msg), msg);
            }
        }

        if (applied.length > 0) {
            this.processPending(applied);
        }

        return applied;
    }

    get(index: number): string {
        if (index < 0 || index >= this.length()) {
            throw new Error("Index out of bounds");
        }

        const node = this.tree.getByIndex(this.tree.root, index);
        return node.value!;
    }

    length(): number {
        return this.tree.root.size;
    }

    observe(): string {
        let res = "";
        for (const t of this.tree.traverse(this.tree.root)) {
            res += t;
        }
        return res;
    }

    save(): Uint8Array {
        const bytes = this.tree.save();
        return bytes;
    }

    load(data: Uint8Array | null) {
        if (!data) return;
        this.tree.load(data);
    }

    replicaId(): string {
        return this.replicaID;
    }

    getById(id: ID) {
        return this.tree.getByID(id);
    }

    getVisibleIndex(node: FNode) {
        return this.tree.getVisibleIndex(node);
    }
}
