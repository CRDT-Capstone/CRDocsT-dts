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
    /* 
    The join message is sent from the user to the server when the user first joins 
    It is also sent from the server to the user with the state of the document and collaborators filled out

    When the user rejoins after being offline for a while, the localState field will be populated and sent to the server
    for reconciliation with other replicas
    */
    operation: Operation.JOIN;
    documentID: string;
    userIdentity?: string;
    collaborators?: string[];
    state: Uint8Array<ArrayBufferLike> | null;
    //the existing state of the document 
    localState: Uint8Array<ArrayBufferLike> | null;
    replicaId?: string;
}

export interface FugueRejectMessage {
    operation: Operation.REJECT;
}

export interface FugueLeaveMessage {
    operation: Operation.LEAVE;
    userIdentity: string;
}

export interface FugueUserJoinMessage {
    operation: Operation.JOIN;
    userIdentity: string;
}

export type FugueMessageType = FugueMessage | FugueJoinMessage | FugueRejectMessage | FugueLeaveMessage | FugueUserJoinMessage;

export type FugueMutationMessageTypes = Extract<FugueMessageType, FugueMessage | FugueJoinMessage>;
