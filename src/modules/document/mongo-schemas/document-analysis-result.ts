import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DocumentAnalysisParagraphStatus } from '../document.constants';
import { IParagraphAnalysisResult } from '../document.interfaces';

export class ParagraphAnalysisResult {
    @Prop({
        type: String,
        enum: [...Object.values(DocumentAnalysisParagraphStatus)],
        required: true,
    })
    status: DocumentAnalysisParagraphStatus;

    @Prop({
        type: String,
        required: true,
    })
    rawParagraph: string;

    @Prop({
        type: String,
        required: true,
    })
    rawResult: string | null;
}

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.DOCUMENT_ANALYSIS_RESULTS,
})
export class DocumentAnalysisResult extends BaseEntity {
    @Prop({
        type: Types.ObjectId,
        ref: Document.name,
        required: true,
    })
    documentId: string;

    @Prop({
        type: Types.Array<ParagraphAnalysisResult>,
        required: true,
        default: [],
    })
    result: IParagraphAnalysisResult[];
}

export type DocumentAnalysisResultDocument = DocumentAnalysisResult & Document;
export const DocumentAnalysisResultSchema = SchemaFactory.createForClass(
    DocumentAnalysisResult,
);

export const documentAnalysisResultAttributes = ['documentId', 'result'];
