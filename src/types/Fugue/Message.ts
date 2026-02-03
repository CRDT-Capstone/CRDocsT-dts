import { FugueState } from "./Fugue.js";

export enum Operation {
    INSERT,
    DELETE,
    JOIN,
    REJECT,
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
}

export interface FugueRejectMessage {
    operation: Operation.REJECT;
}

export type FugueMessageType<P> = FugueMessage<P> | FugueJoinMessage<P> | FugueRejectMessage;
