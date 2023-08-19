import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.TOPICS,
})
export class Topic extends BaseEntity {
    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
    })
    description: string;
}

export type TopicDocument = Topic & Document;
export const TopicSchema = SchemaFactory.createForClass(Topic);

export const topicAttributes = ['name', 'description'];
