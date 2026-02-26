import { BaseMessage, MessageType } from "./Message.js";

export enum PresenceMessageType {
    CURSOR,
    SELECTION,
}

export interface BasePresenceMessage<T extends PresenceMessageType = PresenceMessageType>
    extends BaseMessage<MessageType.PRESENCE> {
    type: T;
}

export interface PresenceCursorMessage extends BasePresenceMessage<PresenceMessageType.CURSOR> {
    pos: number;
}

export type PresenceMessage = PresenceCursorMessage;

export const makePresenceMsg = <T extends PresenceMessage>(msg: Omit<T, "msgType">): BasePresenceMessage => {
    return {
        ...msg,
        msgType: MessageType.PRESENCE,
    };
};
