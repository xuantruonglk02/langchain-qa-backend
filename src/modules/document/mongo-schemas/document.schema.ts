import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { File } from '@/modules/file/mongo-schemas/file.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Document as MongooseDocument, Types } from 'mongoose';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.DOCUMENTS,
})
export class Document extends BaseEntity {
    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: Types.ObjectId,
        ref: File.name,
        required: false,
        default: null,
    })
    fileId: ObjectId;
}

export type DocumentDocument = Document & MongooseDocument;
export const DocumentSchema = SchemaFactory.createForClass(Document);

export const documentAttributes = ['name', 'fileId'];
