import { commonListQuerySchema } from '@/common/constants';
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
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { FileService } from '../file/services/file.service';
import {
    IConfirmDocumentUploaded,
    ICreateDocument,
    IGetUrlUploadDocument,
} from './document.interfaces';
import {
    confirmDocumentUploadedBodySchema,
    createDocumentBodySchema,
    getUrlUploadDocumentQuerySchema,
} from './document.validators';
import { DocumentService } from './services/document.service';

@Controller('/document')
export class DocumentController {
    constructor(
        private readonly logger: Logger,
        private readonly documentService: DocumentService,
        private readonly fileService: FileService,
    ) {}

    @Get('/')
    async getDocumentsList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(commonListQuerySchema),
        )
        query: ICommonListQuery,
    ) {
        try {
            const documentList =
                await this.documentService.getDocumentDetailsList(query);
            return new SuccessResponse(documentList);
        } catch (error) {
            this.logger.error(
                'In getDocumentList()',
                error,
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
    ) {
        try {
            const document = await this.documentService.getDocumentById(id, [
                '_id',
                'fileId',
            ]);
            if (!document) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        code: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }
            if (document.fileId) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        code: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'id',
                    },
                ]);
            }

            const uploadFile =
                await this.documentService.getUrlUploadDocumentToS3(
                    query.fileExtension,
                    null as any,
                );
            return new SuccessResponse(uploadFile);
        } catch (error) {
            this.logger.error(
                'In getUrlUploadDocument()',
                error,
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
    ) {
        try {
            const document = await this.documentService.createDocument(
                body,
                null as any,
            );
            return new SuccessResponse(document);
        } catch (error) {
            this.logger.error(
                'In createDocument()',
                error,
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
    ) {
        try {
            const document = await this.documentService.getDocumentById(id, [
                '_id',
                'fileId',
            ]);
            if (!document) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        code: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }
            if (document.fileId) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        code: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'id',
                    },
                ]);
            }

            const isFileMapped =
                await this.documentService.checkDocumentMappedToFile(
                    body.fileId,
                );
            if (isFileMapped) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        code: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'fileId',
                    },
                ]);
            }

            const file = await this.fileService.getFileByIdAndKey(
                body.fileId,
                body.fileKey,
                ['_id'],
            );
            if (!file) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        code: HttpStatus.NOT_FOUND,
                        key: 'fileId',
                    },
                ]);
            }

            const updatedDocument =
                await this.documentService.confirmDocumentUploadedToS3(
                    id,
                    body.fileId,
                    null as any,
                );
            if (!updatedDocument) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        code: HttpStatus.NOT_FOUND,
                        key: 'fileId',
                    },
                ]);
            }

            return new SuccessResponse(updatedDocument);
        } catch (error) {
            this.logger.error(
                'In confirmDocumentUploaded()',
                error,
                DocumentController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
