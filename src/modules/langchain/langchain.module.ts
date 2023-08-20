import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    DocumentAnalysisResult,
    DocumentAnalysisResultSchema,
} from '../document/mongo-schemas/document-analysis-result';
import { LangchainService } from './langchain.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: DocumentAnalysisResult.name,
                schema: DocumentAnalysisResultSchema,
            },
        ]),
    ],
    providers: [Logger, LangchainService],
    exports: [LangchainService],
})
export class LangchainModule {}
