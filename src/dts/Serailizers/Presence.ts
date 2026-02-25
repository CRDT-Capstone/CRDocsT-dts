import { encode, decode } from "@msgpack/msgpack";
import { BasePresenceMessage } from "../../types/Presence.js";
import { MessageType } from "../../types/Message.js";

function serialize(msgs: BasePresenceMessage[]) {
    if (msgs.length === 0) return new Uint8Array();
    const enced = encode(msgs);

    // Add magic byte at the beginning to indicate message type
    const buff = new Uint8Array(enced.length + 1);
    buff[0] = MessageType.PRESENCE;
    buff.set(enced, 1);
    return buff;
}

function deserialize(data: Uint8Array): BasePresenceMessage[] {
    if (data.length === 0) return [];

    const type = data[0] as MessageType;
    const payload = data.slice(1);
    return decode(payload) as BasePresenceMessage[];
}

export const PresenceMessageSerializer = {
    serialize,
    deserialize,
};
