import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DocumentExtension, FileType } from '../file.constants';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.FILES,
})
export class File extends BaseEntity {
    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
    })
    key: string;

    @Prop({
        type: String,
        enum: [...Object.values(FileType)],
        required: true,
    })
    type: FileType;

    @Prop({
        type: String,
        enum: [...Object.values(DocumentExtension)],
        required: true,
    })
    extension: DocumentExtension;

    @Prop({
        type: String,
        required: false,
    })
    presignedUrl: string;

    @Prop({
        type: Date,
        required: false,
    })
    presignedUrlCreatedAt: string;
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);

export const fileAttributes = [
    'name',
    'key',
    'type',
    'extension',
    'presignedUrl',
    'presignedUrlCreatedAt',
];
