import { FugueState } from "./Fugue.js";

export enum Operation {
    INSERT,
    DELETE,
    JOIN,
    REJECT,
    LEAVE
}

export type Data = string;

export interface FugueMessage<P> {
    operation: Operation.INSERT | Operation.DELETE;
    documentID: string;
    replicaId: string;
    position: P;
    data: Data | null;
    email?: string;
}

export interface FugueJoinMessage<P> {
    operation: Operation.JOIN;
    documentID: string;
    state: FugueState<P> | null;
    email?: string;
    collaborators?: string[];
}

export interface FugueRejectMessage {
    operation: Operation.REJECT;
}

export interface FugueLeaveMessage {
    operation: Operation.LEAVE;
    email: string
}

export type FugueMessageType<P> = FugueMessage<P> | FugueJoinMessage<P> | FugueRejectMessage | FugueLeaveMessage;
