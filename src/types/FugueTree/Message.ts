import { ID, NodeSide } from "../../dts/FugueTree/FTree";

export enum Operation {
    INSERT,
    DELETE,
    INITIAL_SYNC,
    USER_JOIN,
    REJECT,
    LEAVE,
}

export function operationToString(op: Operation): string {
    switch (op) {
        case Operation.INSERT:
            return "INSERT";
        case Operation.DELETE:
            return "DELETE";
        case Operation.INITIAL_SYNC:
            return "INITIAL_SYNC";
        case Operation.USER_JOIN:
            return "USER_JOIN";
        case Operation.REJECT:
            return "REJECT";
        case Operation.LEAVE:
            return "LEAVE";
        default:
            return "UNKNOWN_OPERATION";
    }
}

export type Data = string;

// Base message interface that all other message types will extend
export interface BaseFugueMessage<T extends Operation = Operation> {
    operation: T;
    documentID: string;
    replicaId: string;
    userIdentity: string; // All users should be identified even anonymous users
}

export interface FugueMessage extends BaseFugueMessage<Operation.INSERT | Operation.DELETE> {
    id: ID;
    data: Data | null;
    side: NodeSide;
    parent?: ID;
    rightOrigin?: ID;
    coastTxId?: string;
    coastNodeKey?: string;
    coastOpType?: string;
    coastOpPart?: string;
}

export interface FugueJoinMessage extends BaseFugueMessage<Operation.INITIAL_SYNC> {
    state: Uint8Array<ArrayBufferLike> | null;
    //the existing state of the document
    bufferedOperations?: Buffer<ArrayBuffer>[];
    //We buffer all operations
}

export interface FugueRejectMessage extends BaseFugueMessage<Operation.REJECT> {
    documentID: string;
    reason: string;
}

export interface FugueLeaveMessage extends BaseFugueMessage<Operation.LEAVE> {
    userIdentity: string;
    collaborators: string[];
}

export interface FugueUserJoinMessage extends BaseFugueMessage<Operation.USER_JOIN> {
    collaborators: string[];
}

export type FugueMessageType =
    | FugueMessage
    | FugueJoinMessage
    | FugueRejectMessage
    | FugueLeaveMessage
    | FugueUserJoinMessage;

export type FugueMutationMessageTypes = Extract<FugueMessageType, FugueMessage | FugueJoinMessage>;
