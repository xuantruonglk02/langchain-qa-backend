import { ConfigKey } from '@/common/configs/config-keys';
import dotenv from 'dotenv';
import { ChatOpenAI as ChatOpenAILangchain } from 'langchain/chat_models/openai';

dotenv.config();

class ChatOpenAI extends ChatOpenAILangchain {
    constructor() {
        super({
            modelName: process.env[ConfigKey.OPENAI_MODEL_NAME],
            openAIApiKey: process.env[ConfigKey.OPENAI_API_KEY],
            temperature: parseInt(
                process.env[ConfigKey.OPENAI_TEMPERATURE] as string,
            ),
            // timeout: 5000,
            verbose: process.env[ConfigKey.OPENAI_VERBOSE] === 'true',
        });
    }
}

export const chatOpenAIModel = new ChatOpenAI();
