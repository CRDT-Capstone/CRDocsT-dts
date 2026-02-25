import { encode, decode } from "@msgpack/msgpack";
import { BasePresenceMessage } from "../../types/Presence.js";
import { BaseMessage, MessageType } from "../../types/Message.js";
import { BaseFugueMessage } from "../../types/index.js";
import { FugueMessageSerialzier } from "./FugueTree/Message.js";
import { PresenceMessageSerializer } from "./Presence.js";

export type Message = BaseFugueMessage[] | BasePresenceMessage[];

function serialize(msgs: BaseMessage | BaseMessage[]): Uint8Array {
    const msgArr = Array.isArray(msgs) ? msgs : [msgs];
    const type = msgArr[0].msgType;

    switch (type) {
        case MessageType.FUGUE:
            return FugueMessageSerialzier.serialize(msgArr as BaseFugueMessage[]);
        case MessageType.PRESENCE:
            return PresenceMessageSerializer.serialize(msgArr as BasePresenceMessage[]);
        default:
            // Exhastive check to make sure we handled all message types
            const _exhaustiveCheck: never = type;
            throw new Error(`Unsupported message type: ${type}`);
    }
}

function deserialize(bytes: Uint8Array): Message {
    if (bytes.length === 0) return [];

    // Read magic byte to determine message type
    const type = bytes[0] as MessageType;

    switch (type) {
        case MessageType.FUGUE:
            return FugueMessageSerialzier.deserialize(bytes);
        case MessageType.PRESENCE:
            return PresenceMessageSerializer.deserialize(bytes);
        default:
            // Exhastive check to make sure we handled all message types
            const _exhaustiveCheck: never = type;
            throw new Error(`Unsupported message type: ${type}`);
    }
}

export const Seralizer = {
    serialize,
    deserialize,
};
