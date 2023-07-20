import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ITEM_PER_PAGE_LIMIT,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    MongoOrderDirection,
    softDeleteCondition,
} from '@/common/constants';
import { ICommonListQuery } from '@/common/interfaces';
import { DocumentExtension, FileType } from '@/modules/file/file.constants';
import { FileService } from '@/modules/file/services/file.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';
import { ICreateDocument } from '../document.interfaces';
import {
    Document,
    DocumentDocument,
    documentAttributes,
} from '../mongo-schemas/document.schema';

@Injectable()
export class DocumentService {
    constructor(
        @InjectModel(Document.name)
        private readonly documentModel: Model<DocumentDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        private readonly logger: Logger,
        private readonly fileService: FileService,
    ) {}

    async getDocumentById(id: ObjectId, attrs = documentAttributes) {
        try {
            return await this.documentModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .select(attrs);
        } catch (error) {
            this.logger.error(
                'In getDocumentById()',
                error,
                DocumentService.name,
            );
            throw error;
        }
    }

    async getDocumentDetailsList(query: ICommonListQuery) {
        try {
            const {
                page = DEFAULT_FIRST_PAGE,
                limit = DEFAULT_ITEM_PER_PAGE_LIMIT,
                keyword = '',
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
            } = query;
            const getListQuery: Record<string, any> = {
                ...softDeleteCondition,
            };
            if (keyword) {
                getListQuery.name = {
                    $regex: `.*${keyword}.*`,
                    $options: 'i',
                };
            }

            const [documentList, total] = await Promise.all([
                this.documentModel.aggregate([
                    { $match: getListQuery },
                    {
                        $sort: {
                            [orderBy]: MongoOrderDirection[orderDirection],
                        },
                    },
                    {
                        $skip:
                            parseInt(limit.toString()) *
                            (parseInt(page.toString()) - 1),
                    },
                    { $limit: parseInt(limit.toString()) },
                ]),
                this.documentModel.countDocuments(getListQuery),
            ]);

            const fileIds = documentList.map((document) => document.fileId);
            const files = await Promise.all(
                fileIds.map((id) => this.fileService.getFileDetailById(id)),
            );

            return {
                items: documentList.map((document, index) => ({
                    ...document,
                    fileUrl: files[index]?.presignedUrl,
                })),
                totalItems: total,
            };
        } catch (error) {
            this.logger.error(
                'In getDocumentList()',
                error,
                DocumentService.name,
            );
            throw error;
        }
    }

    async checkDocumentMappedToFile(fileId: ObjectId) {
        try {
            const document = this.documentModel
                .findOne({
                    fileId,
                    ...softDeleteCondition,
                })
                .select(['_id']);
            return document;
        } catch (error) {
            this.logger.error(
                'In getDocumentMappedToFile()',
                error,
                DocumentService.name,
            );
            throw error;
        }
    }

    async createDocument(body: ICreateDocument, userId: ObjectId) {
        try {
            const documents = await this.documentModel.create([
                {
                    name: body.name,
                    createdBy: userId,
                },
            ]);
            return documents[0];
        } catch (error) {
            this.logger.error(
                'In createDocument()',
                error,
                DocumentService.name,
            );
            throw error;
        }
    }

    async getUrlUploadDocumentToS3(
        fileExtension: DocumentExtension,
        userId: ObjectId,
    ) {
        try {
            const uploadedFile = await this.fileService.uploadFile(
                FileType.DOCUMENT,
                fileExtension,
                userId,
            );
            return uploadedFile;
        } catch (error) {
            this.logger.error(
                'In getUrlUploadDocumentToS3()',
                error,
                DocumentService.name,
            );
            throw error;
        }
    }

    async confirmDocumentUploadedToS3(
        documentId: ObjectId,
        fileId: ObjectId,
        userId: ObjectId,
    ) {
        const session = await this.connection.startSession();
        try {
            session.startTransaction();

            const fileDetail = await this.fileService.getFileDetailById(
                fileId,
                session,
            );
            if (!fileDetail?.presignedUrl) {
                return null;
            }

            const document = await this.documentModel.findOneAndUpdate(
                { _id: documentId },
                {
                    $set: {
                        fileId: fileId,
                        updatedAt: new Date(),
                        updatedBy: userId,
                    },
                },
                { session, new: true },
            );

            await session.commitTransaction();
            return document;
        } catch (error) {
            await session.abortTransaction();
            this.logger.error(
                'In confirmDocumentUploadedToS3()',
                error,
                DocumentService.name,
            );
            throw error;
        } finally {
            session.endSession();
        }
    }
}
