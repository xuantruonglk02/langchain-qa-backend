import { ObjectId } from 'mongodb';
import { MessageType } from './conversation.constants';

export interface ICreateConversation {
    title: string;
}
export interface ICreateMessage {
    conversationId: ObjectId;
    type: MessageType;
    message: string;
}
