import { BasePresenceMessage } from "../../types/Presence.js";
import { BaseMessage, MessageType } from "../../types/Message.js";
import { BaseFugueMessage } from "../../types/index.js";
import { FugueMessageSerialzier } from "./FugueTree/Message.js";
import { PresenceMessageSerializer } from "./Presence.js";
import Pako from "pako";
import { logger } from "../../utils/logging.js";

export type Message = BaseFugueMessage[] | BasePresenceMessage[];

export const COMP = true;
const COMPRESSION_CUTOFF = 1024; // Only compress messages larger than 1KB
logger.log(`Using compression -> ${COMP}`);

function serialize(msgs: BaseMessage | BaseMessage[]): Uint8Array {
    const msgArr = Array.isArray(msgs) ? msgs : [msgs];
    const type = msgArr[0].msgType;

    let bytes: Uint8Array;
    switch (type) {
        case MessageType.FUGUE:
            bytes = FugueMessageSerialzier.serialize(msgArr as BaseFugueMessage[]);
            break;
        case MessageType.PRESENCE:
            bytes = PresenceMessageSerializer.serialize(msgArr as BasePresenceMessage[]);
            break;
        default:
            // Exhastive check to make sure we handled all message types
            const _exhaustiveCheck: never = type;
            throw new Error(`Unsupported message type: ${type}`);
    }

    if (COMP) {
        // Only compress if the payload is at least the COMPRESSION_CUTOFF to avoid overhead of compression for small messages
        if (bytes.length >= COMPRESSION_CUTOFF) {
            bytes = Pako.gzip(bytes);
        }
    }
    return bytes;
}

function deserialize(bytes: Uint8Array): Message {
    if (bytes.length === 0) return [];

    let data = bytes;

    // Check for Gzip Magic Bytes: 0x1f (31) and 0x8b (139), indicating the data is compressed with gzip
    if (data.length > 2 && data[0] === 0x1f && data[1] === 0x8b) {
        try {
            data = Pako.ungzip(data);
        } catch (e) {
            throw e;
        }
    }

    const type = data[0] as MessageType;

    switch (type) {
        case MessageType.FUGUE:
            return FugueMessageSerialzier.deserialize(data);
        case MessageType.PRESENCE:
            return PresenceMessageSerializer.deserialize(data);
        default:
            const _exhaustiveCheck: never = type;
            throw new Error(`Unsupported message type: ${type}`);
    }
}

export const Serializer = {
    serialize,
    deserialize,
};
