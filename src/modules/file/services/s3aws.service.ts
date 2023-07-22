import { ConfigKey } from '@/common/configs/config-keys';
import {
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3AWSService {
    private readonly s3Client: S3Client;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {
        this.s3Client = new S3Client({
            region: configService.get(ConfigKey.AWS_BUCKET_REGION),
            credentials: {
                accessKeyId: configService.get(
                    ConfigKey.AWS_ACCESS_KEY_ID,
                ) as string,
                secretAccessKey: configService.get(
                    ConfigKey.AWS_SECRET_ACCESS_KEY,
                ) as string,
            },
        });
    }

    async createPresignedUrlGetObject(fileKey: string) {
        try {
            const command = new GetObjectCommand({
                Bucket: this.configService.get(ConfigKey.AWS_BUCKET_NAME),
                Key: fileKey,
            });
            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: this.configService.get(
                    ConfigKey.AWS_PRESIGNED_URL_GET_OBJECT_EXPIRES_IN,
                ) as unknown as number,
            });
            return signedUrl;
        } catch (error: any) {
            this.logger.error(
                'In createPresignedUrlGetObject()',
                error.stack,
                S3AWSService.name,
            );
            throw error;
        }
    }

    async createPresignedUrlPutObject(fileKey: string) {
        try {
            const command = new PutObjectCommand({
                Bucket: this.configService.get(ConfigKey.AWS_BUCKET_NAME),
                Key: fileKey,
            });
            const signedUrl = await getSignedUrl(this.s3Client, command, {
                expiresIn: this.configService.get(
                    ConfigKey.AWS_PRESIGNED_URL_PUT_OBJECT_EXPIRES_IN,
                ) as unknown as number,
            });
            return signedUrl;
        } catch (error: any) {
            this.logger.error(
                'In createPresignedUrlPutObject()',
                error.stack,
                S3AWSService.name,
            );
            throw error;
        }
    }

    async getObjectKeys(prefix?: string) {
        try {
            const command = new ListObjectsV2Command({
                Bucket: this.configService.get(ConfigKey.AWS_BUCKET_NAME),
                Prefix: prefix,
            });
            const response = await this.s3Client.send(command);
            return response.Contents?.map((object: any) => object.Key) ?? [];
        } catch (error: any) {
            this.logger.error(
                'In getObjectKeys()',
                error.stack,
                S3AWSService.name,
            );
            throw error;
        }
    }

    async deleteObjects(fileKeys: string[]) {
        try {
            const command = new DeleteObjectsCommand({
                Bucket: this.configService.get(ConfigKey.AWS_BUCKET_NAME),
                Delete: {
                    Objects: fileKeys.map((key) => ({ Key: key })),
                },
            });
            return await this.s3Client.send(command);
        } catch (error: any) {
            this.logger.error(
                'In deleteObjects()',
                error.stack,
                S3AWSService.name,
            );
            throw error;
        }
    }
}
