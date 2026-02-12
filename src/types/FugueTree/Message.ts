import { ID, NodeSide } from "../../dts/FugueTree/FTree";

export enum Operation {
    INSERT,
    DELETE,
    JOIN,
    REJECT,
    LEAVE,
}

export type Data = string;

export interface FugueMessage {
    operation: Operation.INSERT | Operation.DELETE;
    documentID: string;
    replicaId: string;
    id: ID;
    data: Data | null;
    side: NodeSide;
    parent?: ID;
    rightOrigin?: ID;
    userIdentity?: string;
}

export interface FugueJoinMessage {
    operation: Operation.JOIN;
    documentID: string;
    userIdentity?: string;
    collaborators?: string[];
    state: Uint8Array<ArrayBufferLike> | null;
    replicaId?: string;
}

export interface FugueRejectMessage {
    operation: Operation.REJECT;
}

export interface FugueLeaveMessage {
    operation: Operation.LEAVE;
    userIdentity: string;
}

export type FugueMessageType = FugueMessage | FugueJoinMessage | FugueRejectMessage | FugueLeaveMessage;

export type FugueMutationMessageTypes = Extract<FugueMessageType, FugueMessage | FugueJoinMessage>;
