import { encode, decode } from "@msgpack/msgpack";
import { compress, decompress } from "lz4js";
import { FugueState } from "../../../types/index.js";

function serialize(state: FugueState<string>): Uint8Array<ArrayBufferLike> {
    // const flat = state.flatMap((c) => c.map((n) => [n.position, n.value]));
    const bin = encode(state);
    const com = compress(bin);
    return com;
}

function deserialize(compressed: Uint8Array<ArrayBufferLike>): FugueState<string> {
    const raw = decompress(compressed);
    const state = decode(raw) as FugueState<string>;
    return state;
}

export const FugueStateSerializer = {
    serialize,
    deserialize,
};
