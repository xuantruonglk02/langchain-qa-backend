import { ConfigKey } from '@/common/configs/config-keys';
import { PineconeClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import dotenv from 'dotenv';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';

dotenv.config();

class PineconeProhibitedData {
    private readonly openAIEmbedding: OpenAIEmbeddings;
    private readonly client: PineconeClient;
    private index: VectorOperationsApi;
    public vectorStore: PineconeStore;

    constructor() {
        this.openAIEmbedding = new OpenAIEmbeddings({
            openAIApiKey: process.env[ConfigKey.OPENAI_API_KEY],
            verbose: process.env[ConfigKey.OPENAI_VERBOSE] === 'true',
        });
        this.client = new PineconeClient();
    }

    async initialize() {
        try {
            await this.client.init({
                apiKey: process.env[ConfigKey.PINECONE_PD_API_KEY] as string,
                environment: process.env[
                    ConfigKey.PINECONE_PD_ENVIRONMENT
                ] as string,
            });
            this.index = this.client.Index(
                process.env[ConfigKey.PINECONE_PD_INDEX] as string,
            );
            this.vectorStore = await PineconeStore.fromExistingIndex(
                this.openAIEmbedding,
                {
                    pineconeIndex: this.index,
                },
            );
        } catch (error) {
            throw error;
        }
    }
}

export const pineconePD = new PineconeProhibitedData();
