import { ID, NodeSide } from "../../dts/FugueTree/FTree.js";
import { OperationPart, OperationType } from "../../treesitter.js";
import { BaseMessage, MessageType } from "../Message.js";

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
export interface BaseFugueMessage<T extends Operation = Operation> extends BaseMessage<MessageType.FUGUE> {
    operation: T;
    replicaId: string;
}

export interface FugueMessage extends BaseFugueMessage<Operation.INSERT | Operation.DELETE> {
    id: ID;
    data: Data | null;
    side: NodeSide;
    parent?: ID;
    rightOrigin?: ID;
    coastTxId?: string;
    coastNodeKey?: string;
    coastOpType?: OperationType;
    coastOpPart?: OperationPart;
    coastExpectedInsertCount?: number;
    coastExpectedDeleteCount?: number;
}

export interface FugueJoinMessage extends BaseFugueMessage<Operation.INITIAL_SYNC> {
    state: Uint8Array<ArrayBufferLike> | null;
    //the existing state of the document
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
    offlineState?: Uint8Array<ArrayBufferLike>;
}

export type FugueMessageType =
    | FugueMessage
    | FugueJoinMessage
    | FugueRejectMessage
    | FugueLeaveMessage
    | FugueUserJoinMessage;

export type FugueMutationMessageTypes = Extract<FugueMessageType, FugueMessage | FugueJoinMessage>;

export const makeFugueMessage = <T extends FugueMessageType>(msg: Omit<T, "msgType">): BaseFugueMessage => {
    return {
        ...msg,
        msgType: MessageType.FUGUE,
    };
};
