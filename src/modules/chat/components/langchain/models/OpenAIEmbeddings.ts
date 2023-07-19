import { ConfigKey } from '@/common/configs/config-keys';
import dotenv from 'dotenv';
import { OpenAIEmbeddings as OpenAIEmbeddingsLangchain } from 'langchain/embeddings/openai';

dotenv.config();

class OpenAIEmbeddings extends OpenAIEmbeddingsLangchain {
    constructor() {
        super({
            openAIApiKey: process.env[ConfigKey.OPENAI_API_KEY],
            verbose: process.env[ConfigKey.OPENAI_VERBOSE] === 'true',
        });
    }
}

export const openAIEmbeddings = new OpenAIEmbeddings();
