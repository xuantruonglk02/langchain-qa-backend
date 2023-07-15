import { ConfigKey } from '@/common/configs/config-keys';
import dotenv from 'dotenv';
import { ChatOpenAI as ChatOpenAILangchain } from 'langchain/chat_models/openai';

dotenv.config();

export class ChatOpenAI extends ChatOpenAILangchain {
    constructor() {
        super({
            modelName: 'gpt-3.5-turbo',
            temperature: 0,
            timeout: 5000,
            openAIApiKey: process.env[ConfigKey.OPENAI_API_KEY],
            verbose: process.env[ConfigKey.OPENAI_VERBOSE] === 'true',
        });
    }
}

export const chatOpenAI = new ChatOpenAI();
