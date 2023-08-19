import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../file/file.module';
import { LangchainModule } from '../langchain/langchain.module';
import { TopicModule } from '../topic/topic.module';
import { DocumentController } from './document.controller';
import { Document, DocumentSchema } from './mongo-schemas/document.schema';
import { DocumentService } from './services/document.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Document.name, schema: DocumentSchema },
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
