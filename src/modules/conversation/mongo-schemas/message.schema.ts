import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MessageType } from '../conversation.constants';
import { Conversation } from './conversation.schema';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.MESSAGES,
})
export class Message extends BaseEntity {
    @Prop({
        type: Types.ObjectId,
        ref: Conversation.name,
        required: true,
    })
    conversationId: string;

    @Prop({
        type: String,
        enum: [...Object.values(MessageType)],
        required: true,
    })
    type: MessageType;

    @Prop({
        type: String,
        required: true,
    })
    content: string;

    @Prop({
        type: String,
        required: false,
    })
    raw: string;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);

export const messageAttributes = ['conversationId', 'type', 'content'];
