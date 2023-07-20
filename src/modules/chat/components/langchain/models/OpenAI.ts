import { ConfigKey } from '@/common/configs/config-keys';
import dotenv from 'dotenv';
import { ChatOpenAI as OpenAILangchain } from 'langchain/chat_models/openai';
import { LangchainConfigs } from '../configs/configs';

dotenv.config();

class OpenAI extends OpenAILangchain {
    constructor() {
        super({
            modelName: LangchainConfigs.models.openAI.modelName,
            temperature: LangchainConfigs.models.openAI.temperature,
            // timeout: LangchainConfigs.models.openAI.timeout,
            openAIApiKey: process.env[ConfigKey.OPENAI_API_KEY],
            verbose: process.env[ConfigKey.OPENAI_VERBOSE] === 'true',
        });
    }
}

export const openAIModel = new OpenAI();
