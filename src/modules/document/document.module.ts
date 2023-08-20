import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../file/file.module';
import { LangchainModule } from '../langchain/langchain.module';
import { TopicModule } from '../topic/topic.module';
import { DocumentController } from './document.controller';
import {
    DocumentAnalysisResult,
    DocumentAnalysisResultSchema,
} from './mongo-schemas/document-analysis-result';
import { Document, DocumentSchema } from './mongo-schemas/document.schema';
import { DocumentService } from './services/document.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Document.name, schema: DocumentSchema },
        ]),
        MongooseModule.forFeature([
            {
                name: DocumentAnalysisResult.name,
                schema: DocumentAnalysisResultSchema,
            },
        ]),
        FileModule,
        LangchainModule,
        TopicModule,
    ],
    controllers: [DocumentController],
    providers: [Logger, JwtService, DocumentService],
    exports: [DocumentService],
})
export class DocumentModule {}
