import { FTree } from "../../FugueTree/index.js";
import { COMP } from "../General.js";
import Pako from "pako";

function serialize(state: FTree): Uint8Array<ArrayBufferLike> {
    // return compress(state.save())
    let bytes = state.save();
    if (COMP) {
        bytes = Pako.gzip(bytes);
    }
    return bytes;
}

function deserialize(bytes: Uint8Array<ArrayBufferLike>): FTree {
    if (COMP) {
        bytes = Pako.ungzip(bytes);
    }
    const state = new FTree();
    state.load(bytes);
    return state;
}

export const FugueStateSerializer = {
    serialize,
    deserialize,
};
