import { compress, decompress } from "lz4js";
import { FTree } from "../../FugueTree/index.js";

function serialize(state: FTree): Uint8Array<ArrayBufferLike> {
    // return compress(state.save())
    return state.save();
}

function deserialize(compressed: Uint8Array<ArrayBufferLike>): FTree {
    // const raw = decompress(compressed);
    const raw = compressed;
    const state = new FTree();
    state.load(raw as Uint8Array);
    return state;
}

export const FugueStateSerializer = {
    serialize,
    deserialize,
};
