// Adapted from https://github.com/mweidner037/fugue/blob/main/crdt-benchmarks/benchmarks/fugue-max-simple/factory.js
import { FugueTree, Serializer, FugueMessage } from "../../index.js";
import { AbstractCrdt, CrdtFactory } from "../js-lib/index.js";
import seedrandom from "seedrandom";

export const name = "fugue-tree";

const TAG_MESSAGE = 0;
const TAG_SAVE = 1;

export class FugueTreeFactory implements CrdtFactory {
    private rng: seedrandom.PRNG;

    constructor() {
        this.rng = seedrandom("42");
    }

    create(updateHandler?: (update: Uint8Array) => void): FugueTreeCRDT {
        return new FugueTreeCRDT(this.rng, updateHandler);
    }

    getName(): string {
        return name;
    }
}

export class FugueTreeCRDT implements AbstractCrdt {
    private tree: FugueTree;
    private updateHandler: ((update: Uint8Array) => void) | null;

    constructor(rng: seedrandom.PRNG, updateHandler?: (update: Uint8Array) => void) {
        const replicaID = Math.floor(rng() * 0xffffff)
            .toString(16)
            .padStart(6, "0");

        this.tree = new FugueTree(null, "bench", replicaID);
        this.updateHandler = updateHandler ?? null;
    }

    private encodeUpdate(bytes: Uint8Array, isSave: boolean): Uint8Array {
        const update = new Uint8Array(bytes.length + 1);
        update.set(bytes);
        update[bytes.length] = isSave ? TAG_SAVE : TAG_MESSAGE;
        return update;
    }

    private decodeUpdate(update: Uint8Array): [bytes: Uint8Array, isSave: boolean] {
        return [update.subarray(0, update.length - 1), update[update.length - 1] === TAG_SAVE];
    }

    getEncodedState(): Uint8Array {
        return this.encodeUpdate(this.tree.save(), true);
    }

    applyUpdate(update: Uint8Array): void {
        const [bytes, isSave] = this.decodeUpdate(update);

        if (isSave) {
            this.tree.load(bytes);
        } else {
            const msgs = Serializer.deserialize(bytes) as FugueMessage[];
            this.tree.effect(msgs);
        }
    }

    insertArray(_index: number, _elems: unknown[]): void {
        throw new Error("FugueTree does not support array operations — it is a text-only CRDT");
    }

    deleteArray(_index: number, _len: number): void {
        throw new Error("FugueTree does not support array operations");
    }

    getArray(): unknown[] {
        throw new Error("FugueTree does not support array operations");
    }

    /**
     * Insert text into the shared text implementation.
     */
    insertText(index: number, text: string): void {
        this.insertAndEmit(index, text);
    }

    /**
     * Delete text from the shared text implementation.
     */
    deleteText(index: number, len: number): void {
        this.deleteAndEmit(index, len);
    }

    /**
     * Returns the current document as a string.
     */
    getText(): string {
        return this.tree.observe();
    }

    transact(f: (crdt: AbstractCrdt) => void): void {
        f(this);
    }

    free(): void {}

    private insertAndEmit(index: number, text: string): void {
        const msgs: FugueMessage[] = this.tree.insertMultiple(index, text);
        if (this.updateHandler && msgs.length > 0) {
            const bytes = Serializer.serialize(msgs);
            this.updateHandler(this.encodeUpdate(bytes, false));
        }
    }

    private deleteAndEmit(index: number, len: number): void {
        const msgs: FugueMessage[] = this.tree.deleteMultiple(index, len);
        if (this.updateHandler && msgs.length > 0) {
            const bytes = Serializer.serialize(msgs);
            this.updateHandler(this.encodeUpdate(bytes, false));
        }
    }
}
