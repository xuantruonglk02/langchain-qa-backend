import { commonListQuerySchema } from '@/common/constants';
import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import { ICommonListQuery } from '@/common/interfaces';
import { JoiValidationPipe } from '@/common/pipes/joi.validation.pipe';
import { ParseObjectIdPipe } from '@/common/pipes/objectId.validation.pipe';
import { RemoveEmptyQueryPipe } from '@/common/pipes/removeEmptyQuery.pipe';
import { TrimBodyPipe } from '@/common/pipes/trimBody.pipe';
import {
    Body,
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { FileService } from '../file/services/file.service';
import { TopicService } from '../topic/services/topic.service';
import { DocumentStatus } from './document.constants';
import {
    ICheckDocumentWithTopics,
    IConfirmDocumentUploaded,
    ICreateDocument,
    IGetUrlUploadDocument,
} from './document.interfaces';
import {
    checkDocumentWithTopicsBodySchema,
    confirmDocumentUploadedBodySchema,
    createDocumentBodySchema,
    getUrlUploadDocumentQuerySchema,
} from './document.validators';
import { DocumentService } from './services/document.service';

@Controller('/document')
@UseGuards(AuthenticationGuard)
export class DocumentController {
    constructor(
        private readonly logger: Logger,
        private readonly documentService: DocumentService,
        private readonly fileService: FileService,
        private readonly topicService: TopicService,
    ) {}

    @Get('/')
    async getDocumentsList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(commonListQuerySchema),
        )
        query: ICommonListQuery,
        @Req() req: any,
    ) {
        try {
            const documentList =
                await this.documentService.getDocumentDetailsList(
                    req.loggedUser._id,
                    query,
                );
            return new SuccessResponse(documentList);
        } catch (error: any) {
            this.logger.error(
                'In getDocumentList()',
                error.stack,
                DocumentController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/:id/upload-document-url')
    async getUrlUploadDocument(
        @Param('id', new ParseObjectIdPipe()) id: ObjectId,
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(getUrlUploadDocumentQuerySchema),
        )
        query: IGetUrlUploadDocument,
        @Req() req: any,
    ) {
        try {
            const document = await this.documentService.getDocumentById(id, [
                '_id',
                'fileId',
                'createdBy',
            ]);
            if (!document) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }
            if (
                req.loggedUser._id.toString() !== document.createdBy.toString()
            ) {
                return new ErrorResponse(HttpStatus.FORBIDDEN, [
                    {
                        statusCode: HttpStatus.FORBIDDEN,
                        key: 'id',
                    },
                ]);
            }
            if (document.fileId) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'id',
                    },
                ]);
            }

            const uploadFile =
                await this.documentService.getUrlUploadDocumentToS3(
                    query.fileExtension,
                    req.loggedUser._id,
                );
            return new SuccessResponse(uploadFile);
        } catch (error: any) {
            this.logger.error(
                'In getUrlUploadDocument()',
                error.stack,
                DocumentController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/')
    async createDocument(
        @Body(
            new TrimBodyPipe(),
            new JoiValidationPipe(createDocumentBodySchema),
        )
        body: ICreateDocument,
        @Req() req: any,
    ) {
        try {
            const document = await this.documentService.createDocument(
                body,
                req.loggedUser._id,
            );
            return new SuccessResponse(document);
        } catch (error: any) {
            this.logger.error(
                'In createDocument()',
                error.stack,
                DocumentController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/:id/confirm-document-uploaded')
    async confirmDocumentUploaded(
        @Param('id', new ParseObjectIdPipe()) id: ObjectId,
        @Body(
            new TrimBodyPipe(),
            new JoiValidationPipe(confirmDocumentUploadedBodySchema),
        )
        body: IConfirmDocumentUploaded,
        @Req() req: any,
    ) {
        try {
            const document = await this.documentService.getDocumentById(id, [
                '_id',
                'fileId',
                'createdBy',
            ]);
            if (!document) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }
            if (
                req.loggedUser._id.toString() !== document.createdBy.toString()
            ) {
                return new ErrorResponse(HttpStatus.FORBIDDEN, [
                    {
                        statusCode: HttpStatus.FORBIDDEN,
                        key: 'id',
                    },
                ]);
            }
            if (document.fileId) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'id',
                    },
                ]);
            }

            const isFileMapped =
                await this.documentService.checkDocumentMappedToFile(
                    new ObjectId(body.fileId),
                );
            if (isFileMapped) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'fileId',
                    },
                ]);
            }

            const file = await this.fileService.getFileByIdAndKey(
                new ObjectId(body.fileId),
                body.fileKey,
                ['_id', 'createdBy'],
            );
            if (!file) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'fileId',
                    },
                ]);
            }
            if (req.loggedUser._id.toString() !== file.createdBy.toString()) {
                return new ErrorResponse(HttpStatus.FORBIDDEN, [
                    {
                        statusCode: HttpStatus.FORBIDDEN,
                        key: 'fileId',
                    },
                ]);
            }

            const updatedDocument =
                await this.documentService.confirmDocumentUploadedToS3(
                    id,
                    file._id,
                    req.loggedUser._id,
                );
            if (!updatedDocument) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'fileId',
                    },
                ]);
            }

            return new SuccessResponse(updatedDocument);
        } catch (error: any) {
            this.logger.error(
                'In confirmDocumentUploaded()',
                error.stack,
                DocumentController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/:id/check')
    async checkDocumentWithTopics(
        @Param('id', new ParseObjectIdPipe()) id: ObjectId,
        @Body(
            new TrimBodyPipe(),
            new JoiValidationPipe(checkDocumentWithTopicsBodySchema),
        )
        body: ICheckDocumentWithTopics,
        @Req() req: any,
    ) {
        try {
            const document = await this.documentService.getDocumentById(id, [
                '_id',
                'fileId',
                'status',
                'createdBy',
            ]);
            if (!document) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }
            if (
                req.loggedUser._id.toString() !== document.createdBy.toString()
            ) {
                return new ErrorResponse(HttpStatus.FORBIDDEN, [
                    {
                        statusCode: HttpStatus.FORBIDDEN,
                        key: 'id',
                    },
                ]);
            }
            if (
                !document.fileId ||
                document.status === DocumentStatus.PROCESSING
            ) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'id',
                    },
                ]);
            }

            body.topicIds = body.topicIds.map((id) => new ObjectId(id));
            const allTopicsExist = await this.topicService.checkAllTopicsExist(
                body.topicIds,
            );
            if (!allTopicsExist) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'topicIds',
                    },
                ]);
            }

            const file = await this.fileService.getFileById(document.fileId, [
                'key',
            ]);

            this.documentService
                .checkDocument(id, file?.key as string, body.topicIds)
                .then(() => {
                    this.documentService.updateDocumentProcessingStatusToAccepted(
                        id,
                    );
                })
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .catch((error) => {
                    this.documentService.updateDocumentProcessingStatusToError(
                        id,
                    );
                });
            return new SuccessResponse();
        } catch (error: any) {
            this.logger.error(
                'In checkDocumentWithTopics()',
                error.stack,
                DocumentController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
