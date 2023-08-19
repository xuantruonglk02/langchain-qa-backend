import { ObjectId } from 'mongodb';
import { DocumentExtension } from '../file/file.constants';

export interface ICreateDocument {
    name: string;
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
