import { encode, decode } from "@msgpack/msgpack";
import { compress, decompress } from "lz4js";
import { FTree } from "../../FugueTree/index.js";

function serialize(state: FTree): Uint8Array<ArrayBufferLike> {
    // const flat = state.flatMap((c) => c.map((n) => [n.position, n.value]));
    const bin = state.save();
    // const com = compress(bin);
    const com = bin;
    return com;
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
