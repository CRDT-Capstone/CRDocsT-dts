import { BaseMessage, MessageType } from "./Message.js";

export enum PresenceMessageType {
    CURSOR,
    UPDATE,
    JOIN
}

export interface BasePresenceMessage<
  T extends PresenceMessageType = PresenceMessageType
> extends Omit<BaseMessage<MessageType.PRESENCE>, "documentID"> {
  type: T;
  documentID?: string //had to make document ID optional... things we're getting hard to work with
}

export interface PresenceCursorMessage extends BasePresenceMessage<PresenceMessageType.CURSOR> {
    pos: number;
}

export interface PresenceUpdateMessage extends BasePresenceMessage<PresenceMessageType.UPDATE> { };

export interface PresenceJoinMessage extends BasePresenceMessage<PresenceMessageType.JOIN> { };

export type PresenceMessage = PresenceCursorMessage | PresenceUpdateMessage | PresenceJoinMessage;

export const makePresenceMsg = <T extends PresenceMessage>(msg: Omit<T, "msgType">): BasePresenceMessage => {
    return {
        ...msg,
        msgType: MessageType.PRESENCE,
    };
};
