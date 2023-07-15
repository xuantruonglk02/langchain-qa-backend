import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './mongo-schemas/file.schema';
import { FileService } from './services/file.service';
import { S3AWSService } from './services/s3aws.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    ],
    providers: [Logger, FileService, S3AWSService],
    exports: [FileService],
})
export class FileModule {}
