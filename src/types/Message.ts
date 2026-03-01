export enum MessageType {
    FUGUE,
    PRESENCE,
}

export interface BaseMessage<T extends MessageType = MessageType> {
    msgType: T;
    documentID: string;
    userIdentity: string;
}
