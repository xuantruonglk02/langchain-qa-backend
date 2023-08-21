import { ObjectId } from 'mongodb';
import { DocumentExtension } from '../file/file.constants';
import { DocumentAnalysisParagraphStatus } from './document.constants';

export interface ICreateDocument {
    name: string;
}
export interface IParagraphAnalysisResult {
    status: DocumentAnalysisParagraphStatus;
    rawParagraph: string;
    rawResult: string | null;
}
export interface IGetUrlUploadDocument {
    fileExtension: DocumentExtension;
}
export interface IConfirmDocumentUploaded {
    fileId: ObjectId;
    fileKey: string;
}
export interface ICheckDocumentWithTopics {
    topicIds: ObjectId[];
}
