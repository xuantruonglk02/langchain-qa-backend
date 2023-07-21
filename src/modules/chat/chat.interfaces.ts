import { ObjectId } from 'mongodb';

export interface IChat {
    conversationId: ObjectId;
    message: string;
}
