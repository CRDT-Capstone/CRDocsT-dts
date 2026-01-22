import { encode, decode } from "@msgpack/msgpack";
import { FugueMessage, FugueJoinMessage, FugueMessageType, Operation, FugueRejectMessage } from "../../types/Message.js";

function serialize<P>(msgs: FugueMessageType<P>[]) {
    return encode(msgs.map((m) => toTuple(m)));
}

function deserialize<P>(data: Uint8Array): FugueMessageType<P>[] {
    const dec = decode(data);
    if (Array.isArray(dec) && Array.isArray(dec[0])) {
        return (dec as any[]).map((t) => fromTuple(t));
    }
    return [fromTuple(dec as any[])];
}

function toTuple<P>(msg: FugueMessage<P> | FugueJoinMessage<P> | FugueRejectMessage) {
    // Check if msg is of FugueJoinMessage type
    switch (msg.operation) {
        case Operation.JOIN:
            return [msg.operation, msg.documentID, msg.state];
        case Operation.INSERT:
        case Operation.DELETE:
            return [msg.operation, msg.documentID, msg.replicaId, msg.position, msg.data];
        case Operation.REJECT:
            return [msg.operation]
    }
    throw new Error("Unknown message type");
}

function fromTuple<P>(tuple: any[]): FugueMessageType<P> {
    switch (tuple[0]) {
        case Operation.JOIN:
            return {
                operation: tuple[0],
                documentID: tuple[1],
                state: tuple[2],
            } as FugueJoinMessage<P>;
        case Operation.INSERT:
        case Operation.DELETE:
            return {
                operation: tuple[0],
                documentID: tuple[1],
                replicaId: tuple[2],
                position: tuple[3],
                data: tuple[4],
            } as FugueMessage<P>;
        case Operation.REJECT:
            return {
                operation: tuple[0]
            } as FugueRejectMessage;
    }
    throw new Error("Unknown tuple format");
}

export const FugueMessageSerialzier = {
    serialize,
    deserialize,
};
