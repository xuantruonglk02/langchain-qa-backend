import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.CONVERSATIONS,
})
export class Conversation extends BaseEntity {
    @Prop({
        type: String,
        required: true,
    })
    title: string;
}

export type ConversationDocument = Conversation & Document;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);

export const conversationAttributes = ['title'];
