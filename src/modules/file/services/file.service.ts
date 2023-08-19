import { ConfigKey } from '@/common/configs/config-keys';
import { softDeleteCondition } from '@/common/constants';
import moment from '@/plugins/moment';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { ObjectId } from 'mongodb';
import { ClientSession, Model } from 'mongoose';
import path from 'path';
import { v4 as uuid } from 'uuid';
import {
    DocumentExtension,
    FileType,
    S3FileNamePrefix,
    S3FilePath,
} from '../file.constants';
import {
    File,
    FileDocument,
    fileAttributes,
} from '../mongo-schemas/file.schema';
import { S3AWSService } from './s3aws.service';

@Injectable()
export class FileService {
    constructor(
        @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private readonly s3Service: S3AWSService,
    ) {}

    async getFileByIdAndKey(id: ObjectId, key: string, attrs = fileAttributes) {
        try {
            const file = await this.fileModel
                .findOne({
                    _id: id,
                    key,
                    ...softDeleteCondition,
                })
                .select(attrs);
            return file;
        } catch (error: any) {
            this.logger.error(
                'In getFileByIdAndKey()',
                error.stack,
                FileService.name,
            );
            throw error;
        }
    }

    async getFileById(id: ObjectId, attrs = fileAttributes) {
        try {
            const file = await this.fileModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .select(attrs);
            return file;
        } catch (error: any) {
            this.logger.error(
                'In getFileById()',
                error.stack,
                FileService.name,
            );
            throw error;
        }
    }

    async getFileDetailById(id: ObjectId, session?: ClientSession) {
        try {
            const file = await this.fileModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .session(session ?? null);
            if (!file) {
                return null;
            }

            if (
                file.presignedUrl &&
                file.presignedUrlCreatedAt &&
                moment
                    .utc(file.presignedUrlCreatedAt)
                    .add(
                        this.configService.get(
                            ConfigKey.AWS_PRESIGNED_URL_GET_OBJECT_EXPIRES_IN,
                        ),
                        'second',
                    )
                    .isAfter(moment.utc(moment.now()))
            ) {
                return file;
            } else {
                const fileUrl =
                    await this.s3Service.createPresignedUrlGetObject(file.key);
                const updatedFile = await this.fileModel.findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            presignedUrl: fileUrl,
                            presignedUrlCreatedAt: fileUrl ? new Date() : null,
                        },
                    },
                    { session, new: true },
                );
                return updatedFile;
            }
        } catch (error: any) {
            this.logger.error(
                'In getFileDetailById()',
                error.stack,
                FileService.name,
            );
            throw error;
        }
    }

    async uploadFile(
        fileType: FileType,
        fileExtension: DocumentExtension,
        userId: ObjectId,
        session?: ClientSession,
    ) {
        try {
            const fileId = new ObjectId();
            const fileName = `${S3FileNamePrefix[fileType]}${uuid()}`;
            const fileKey = `${S3FilePath[fileType]}/${fileName}.${fileExtension}`;

            const [files, presignedUrlPutObject] = await Promise.all([
                this.fileModel.create(
                    [
                        {
                            _id: fileId,
                            name: fileName,
                            key: fileKey,
                            type: fileType,
                            extension: fileExtension,
                            createdBy: userId,
                        },
                    ],
                    { session },
                ),
                this.s3Service.createPresignedUrlPutObject(fileKey),
            ]);

            return {
                file: files[0],
                presignedUrlPutObject,
            };
        } catch (error: any) {
            this.logger.error('In uploadFile()', error.stack, FileService.name);
            throw error;
        }
    }

    async downloadDocumentForChecking(fileKey: string) {
        try {
            const dirName = `${this.configService.get(
                ConfigKey.TMP_DATA_FOLDER,
            )}/${path.dirname(fileKey)}`;
            if (!existsSync(dirName)) {
                mkdirSync(dirName, { recursive: true });
            }

            const filePath = `${this.configService.get(
                ConfigKey.TMP_DATA_FOLDER,
            )}/${fileKey}`;

            const { Body: fileBody } = await this.s3Service.getObject(fileKey);
            const fileAsByteArray = await fileBody?.transformToByteArray();

            writeFileSync(filePath, fileAsByteArray as Uint8Array);
            return filePath;
        } catch (error: any) {
            this.logger.error(
                'In downloadDocumentForChecking',
                error.stack,
                FileService.name,
            );
            throw error;
        }
    }
}
