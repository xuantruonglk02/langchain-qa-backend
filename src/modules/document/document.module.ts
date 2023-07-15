import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '../file/file.module';
import { DocumentController } from './document.controller';
import { Document, DocumentSchema } from './mongo-schemas/document.schema';
import { DocumentService } from './services/document.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Document.name, schema: DocumentSchema },
        ]),
        FileModule,
    ],
    controllers: [DocumentController],
    providers: [Logger, DocumentService],
})
export class DocumentModule {}
