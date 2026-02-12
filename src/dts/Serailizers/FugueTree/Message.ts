import { encode, decode } from "@msgpack/msgpack";
import {
    FugueMessage,
    FugueJoinMessage,
    FugueMessageType,
    Operation,
    FugueRejectMessage,
    FugueLeaveMessage,
} from "../../../types/FugueTree/index.js";

function serialize(msgs: FugueMessageType[]) {
    return encode(msgs);
}

function deserialize(data: Uint8Array): FugueMessageType[] {
    const dec = decode(data);
    return dec as FugueMessageType[];
}

export const FugueMessageSerialzier = {
    serialize,
    deserialize,
};
