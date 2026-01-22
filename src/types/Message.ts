import { FugueState } from "./Fugue.js";

export enum Operation {
    INSERT,
    DELETE,
    JOIN,
}

export type Data = string;

export interface FugueMessage<P> {
    operation: Operation.INSERT | Operation.DELETE;
    documentID: string;
    replicaId: string;
    position: P;
    data: Data | null;
    userId?: string;
}

export interface FugueJoinMessage<P> {
    operation: Operation.JOIN;
    documentID: string;
    state: FugueState<P> | null;
    userId?: string
}

export type FugueMessageType<P> = FugueMessage<P> | FugueJoinMessage<P>;
