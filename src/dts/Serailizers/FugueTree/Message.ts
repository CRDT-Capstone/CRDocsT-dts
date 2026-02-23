import { encode, decode } from "@msgpack/msgpack";
import { BaseFugueMessage, FugueMessageType } from "../../../types/FugueTree/index.js";

function serialize(msgs: BaseFugueMessage[]) {
    return encode(msgs);
}

function serializeSingleMessage(msg: FugueMessageType) {
    return encode(msg);
}

function deserialize(data: Uint8Array): BaseFugueMessage[] {
    const dec = decode(data);
    return dec as BaseFugueMessage[];
}

function deserializeSingleMessage(data: Uint8Array): BaseFugueMessage {
    const dec = decode(data);
    return dec as BaseFugueMessage;
}

export const FugueMessageSerialzier = {
    serialize,
    serializeSingleMessage,
    deserialize,
    deserializeSingleMessage,
};
