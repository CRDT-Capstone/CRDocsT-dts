import { FNode } from "./FNode.js";
import { FugueState } from "../types/Fugue.js";
import { UniquelyDenseTotalOrder } from "../TotalOrder/UniquelyDenseTotalOrder.js";
import { FugueMessage, Operation } from "../types/Message.js";

/**
 * A Fugue List CRDT, with insert and delete operations
 */
export class FugueList<P> {
    state: FugueState<P> = [];
    totalOrder: UniquelyDenseTotalOrder<P>;
    positionCounter = 0;
    ws: WebSocket | null;
    documentID: string; //documentID consistent with the database documentID
    readonly batchSize = 100;

    constructor(totalOrder: UniquelyDenseTotalOrder<P>, ws: WebSocket | null, documentID: string) {
        this.totalOrder = totalOrder;
        this.ws = ws;
        this.documentID = documentID;
    }

    /**
     * Propagates message or messages to replicas
     * @param msg - Message or messages to propagate to replicas
     */
    private propagate(msg: FugueMessage<P> | FugueMessage<P>[]) {
        if (!this.ws) return;

        this.ws.send(JSON.stringify(msg));
    }

    private binarySearchPosition(position: P): number {
        let low = 0;
        let high = this.state.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const midPos = this.state[mid][0].position;
            const cmp = this.totalOrder.compare(midPos, position);
            if (cmp === 0) {
                return mid;
            } else if (cmp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        // If not found, return the position where it can be inserted
        return low;
    }

    /**
     * Inserts a value at a given position
     * @param position - Position to insert at
     * @param value - Value to insert
     */
    private insertAtPosition(position: P, value: string) {
        let index = this.binarySearchPosition(position);

        // Check if the position already exists at this index, i.e. there is a collision
        if (index < this.state.length && this.totalOrder.compare(this.state[index][0].position, position) === 0) {
            const cell = this.state[index];
            const existing = cell.find((n) => this.totalOrder.compare(n.position, position) === 0);

            // Don't insert if it already exists,
            // TODO: ideally this should trigger a collision resolution
            if (!existing) {
                cell.push(new FNode<P>(position, value));
                cell.sort((a, b) => this.totalOrder.compare(a.position, b.position));
            }
        }
        // Insert new cell at index
        else {
            this.state.splice(index, 0, [new FNode<P>(position, value)]);
        }
    }

    /**
     * Generates unique position for new element at 'index'
     * @param index - Index to generate position for
     * @returns Generated position
     */
    private generatePosition(index: number): P {
        // If this is the first thing in the document
        if (this.state.length === 0) return this.totalOrder.createBetween();

        const prev = index > 0 ? this.findVisiblePosition(index - 1) : undefined;
        const next = this.findVisiblePosition(index);
        return this.totalOrder.createBetween(prev, next);
    }

    /**
     * Inserts new element with 'value' at 'index' in the list
     * @param index - Index to insert 'value' at
     * @param value - Value to insert
     */
    insert(index: number, value: string) {
        const pos = this.generatePosition(index);
        console.log({ index, pos });

        this.insertAtPosition(pos, value);

        this.propagate({
            documentID: this.documentID,
            replicaId: this.totalOrder.getReplicaId(),
            operation: Operation.INSERT,
            position: pos,
            data: value,
        });
    }

    /**
     * Inserts multiple characters at given index, this
     * handles large insertions by batching messages
     * @param index - Index to insert at
     * @param value - Value to insert
     */
    insertMultiple(index: number, value: string) {
        if (value.length == 0) return;
        if (value.length == 1) {
            this.insert(index, value);
            return;
        }

        // Find left and right anchors
        const lA = index > 0 ? this.findVisiblePosition(index - 1) : undefined;
        const rA = this.findVisiblePosition(index);
        const newCells: FNode<P>[][] = [];

        let cL = lA;
        let msgs: FugueMessage<P>[] = [];
        for (const c of value) {
            const pos = this.totalOrder.createBetween(cL, rA);

            // Collect new cells
            newCells.push([new FNode<P>(pos, c)]);

            // Batch propagate
            msgs.push({
                documentID: this.documentID,
                replicaId: this.totalOrder.getReplicaId(),
                operation: Operation.INSERT,
                position: pos,
                data: c,
            });

            cL = pos;

            if (msgs.length >= this.batchSize) {
                this.propagate(msgs);
                msgs = [];
            }
        }

        // Single splice to insert all new cells
        const firstPos = newCells[0][0].position;
        const insertIndex = this.binarySearchPosition(firstPos);
        this.state.splice(insertIndex, 0, ...newCells);

        // Propagate remaining
        if (msgs.length > 0) {
            this.propagate(msgs);
        }
    }

    /**
     *  Deletes value at given position
     * @param position - Position to delete at
     */
    private deleteAtPosition(position: P) {
        // Find the cell containing this position
        for (let i = 0; i < this.state.length; ++i) {
            const cell = this.state[i];
            const node = cell.find((n) => this.totalOrder.compare(n.position, position) === 0);

            if (node) {
                // Tombstone the node, TODO: Implement garbage collection
                node.value = undefined;
                return;
            }
        }
    }

    /**
     * Finds the position of the visible value at index
     * this ignores tombstoned values
     * @param index - Index of the visible value
     */
    findVisiblePosition(index: number): P | undefined {
        let count = 0;

        for (const cell of this.state) {
            for (const n of cell) {
                if (n.value !== undefined) {
                    if (count === index) return n.position;
                    count++;
                }
            }
        }
    }

    /**
     * Finds the visible index of the value at position
     * this ignores tombstoned values
     * @param position - Position to find visible index for
     * @returns
     */
    findVisibleIndex(position: P): number | undefined {
        let count = 0;

        for (const cell of this.state) {
            for (const n of cell) {
                if (n.value !== undefined) {
                    if (this.totalOrder.compare(n.position, position) === 0) return count;
                    count++;
                }
            }
        }

        return undefined;
    }

    /**
     * Delete value in the list at index
     * @param index - Index of the value to delete
     */
    delete(index: number) {
        const position = this.findVisiblePosition(index);
        console.log({ index, position });

        if (!position) {
            console.warn(`No element at position -> ${position}`);
            return;
        }

        this.deleteAtPosition(position);

        // Send to replicas
        this.propagate({
            documentID: this.documentID,
            replicaId: this.totalOrder.getReplicaId(),
            operation: Operation.DELETE,
            position: position,
            data: null,
        });
    }

    /**
     * Deletes multiple values starting from index, this
     * handles large deletions by batching messages
     * @param index - Starting index to delete from
     * @param count -  Number of values to delete
     */
    deleteMultiple(index: number, count: number) {
        if (count <= 0) return;
        if (count == 1) {
            this.delete(index);
            return;
        }

        let currentVisibleIndex = 0;
        let deletedCount = 0;
        let msgs: FugueMessage<P>[] = [];

        outer: for (const c of this.state) {
            for (const n of c) {
                // Only consider visible nodes
                if (n.value !== undefined) {
                    if (currentVisibleIndex >= index) {
                        const pos = n.position;

                        // Tombstone the node
                        n.value = undefined;
                        deletedCount++;

                        // Batch
                        msgs.push({
                            documentID: this.documentID,
                            replicaId: this.totalOrder.getReplicaId(),
                            operation: Operation.DELETE,
                            position: pos,
                            data: null,
                        });

                        if (msgs.length >= this.batchSize) {
                            this.propagate(msgs);
                            msgs = [];
                        }
                    }
                    // Processed a visible node
                    currentVisibleIndex++;

                    // Check if we've deleted enough
                    if (deletedCount >= count) {
                        break outer;
                    }
                }
            }
        }

        if (msgs.length > 0) {
            this.propagate(msgs);
        }
    }

    /**
     * Observes the current visible state of the list
     * @returns The current visible state of the list as a string
     */
    observe(): string {
        let res = new String();

        for (const idx of this.state) {
            // Filter out tombstoned nodes and sort by unique position
            const nodes = idx
                .filter((n) => n.value !== undefined)
                .sort((a, b) => this.totalOrder.compare(a.position, b.position));

            // Then append to result jand if somehow
            // a value is undefined append empty string
            for (const n of nodes) {
                res += n.value || "";
            }
        }

        return res.toString();
    }

    /**
     * Applies a single effect message to the list
     * @param msg - Message to apply effect for
     */
    private singleEffect(msg: FugueMessage<P>) {
        const { replicaId, operation, data, position } = msg;
        if (replicaId == this.totalOrder.getReplicaId()) return;

        switch (operation) {
            case Operation.INSERT:
                if (!data) throw Error("Data is required for Operation.INSERT");
                return this.insertAtPosition(position, data);
            case Operation.DELETE:
                return this.deleteAtPosition(position);
        }
        throw Error("Invalid operation");
    }

    /**
     * Applies batched effect messages to the list
     * @param msgs - Messages to apply effect for in batch
     */
    private batchEffect(msgs: FugueMessage<P>[]) {
        const inserts: FugueMessage<P>[] = [];
        const deletes = new Set<string>();

        // Separate operations
        for (const msg of msgs) {
            const { replicaId, operation, position, data } = msg;
            if (replicaId == this.totalOrder.getReplicaId()) continue;

            switch (operation) {
                case Operation.INSERT:
                    if (!data) continue;
                    inserts.push(msg);
                    break;
                case Operation.DELETE:
                    deletes.add(JSON.stringify(position));
                    break;
            }
        }

        // Apply deletes first
        if (deletes.size > 0) {
            for (const posStr of deletes) {
                // Parse the position back from the set
                const pos = JSON.parse(posStr) as P;

                const idx = this.binarySearchPosition(pos);

                // Check if we found the right cell
                if (idx < this.state.length) {
                    const cell = this.state[idx];
                    // Find the specific node in the collision cell
                    const node = cell.find((n) => this.totalOrder.compare(n.position, pos) === 0);

                    if (node && node.value !== undefined) {
                        node.value = undefined; // Tombstone
                    }
                }
            }
        }

        // Then apply inserts
        if (inserts.length > 0) {
            inserts.sort((a, b) => this.totalOrder.compare(a.position, b.position));

            // Group into chunks, of contiguous inserts
            let batchCells: FNode<P>[][] = [];
            let startIdx = -1;

            for (const msg of inserts) {
                const { position, data } = msg;

                // Find the index to insert at
                const idx = this.binarySearchPosition(position);

                // Check for collision
                //TODO: should trigger collision resolution
                if (idx < this.state.length && this.totalOrder.compare(this.state[idx][0].position, position) === 0) {
                    const cell = this.state[idx];
                    const existing = cell.find((n) => this.totalOrder.compare(n.position, position) === 0);

                    // Don't insert if it already exists
                    if (!existing) {
                        cell.push(new FNode<P>(position, data ? data : undefined));
                        cell.sort((a, b) => this.totalOrder.compare(a.position, b.position));
                    }
                } else {
                    // Start a new batch if:
                    // - It's the first item
                    // - This index is not contiguous with the previous group
                    if (startIdx === -1) {
                        startIdx = idx;
                        batchCells = [[new FNode<P>(position, data ? data : undefined)]];
                    }
                    // If the index is the same as startIdx, continue the batch
                    else if (idx === startIdx) {
                        batchCells.push([new FNode<P>(position, data ? data : undefined)]);
                    }
                    // The index is different, i.e. not contiguous, so flush the current batch,
                    // commit it and start a new one
                    else {
                        // Commit batch
                        this.state.splice(startIdx, 0, ...batchCells);

                        // Start new batch
                        // Calculate the shift caused by the splice
                        // If the new idx (calculated on old state) is after the splice point,
                        // we must add the length of the batch we just inserted.
                        const shift = idx >= startIdx ? batchCells.length : 0;

                        startIdx = idx + shift;
                        batchCells = [[new FNode<P>(position, data ? data : undefined)]];
                    }
                }
            }

            // Commit any remaining batch
            if (batchCells.length > 0) this.state.splice(startIdx, 0, ...batchCells);
        }
    }

    /**
     * Applies effect messages to the list
     * @param msg - Message or messages to apply effect for, can be batched
     */
    effect(msg: FugueMessage<P> | FugueMessage<P>[]) {
        if (Array.isArray(msg)) {
            this.batchEffect(msg);
            // for (const m of msg) {
            //     this.singleEffect(m);
            // }
        } else {
            this.singleEffect(msg);
        }
    }

    replicaId(): string {
        return this.totalOrder.getReplicaId();
    }

    /**
     * Performs garbage collection by removing tombstoned nodes from the state
     */
    garbageCollect() {
        this.state = this.state.filter((cell) => {
            // Check if cell has any visible nodes
            const hasVisible = cell.some((n) => n.value !== undefined);
            return hasVisible;
        });
    }
}
