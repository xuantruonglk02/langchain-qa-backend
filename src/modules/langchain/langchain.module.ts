import { Logger, Module } from '@nestjs/common';
import { LangchainService } from './langchain.service';

@Module({
    providers: [Logger, LangchainService],
    exports: [LangchainService],
})
export class LangchainModule {}
