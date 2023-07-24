import { ConfigKey } from '@/common/configs/config-keys';
import { getEnvFilePath } from '@/common/helpers/utility-functions';
import { PineconeClient } from '@pinecone-database/pinecone';
import { VectorOperationsApi } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch';
import dotenv from 'dotenv';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { IVectorStoreQuery } from '../langchain.interfaces';
import { openAIEmbeddings } from './OpenAIEmbeddings';

dotenv.config({
    path: getEnvFilePath(),
});

class PineconeData {
    private readonly client: PineconeClient;
    private index: VectorOperationsApi;

    constructor() {
        this.client = new PineconeClient();
    }

    async initialize() {
        try {
            await this.client.init({
                apiKey: process.env[ConfigKey.PINECONE_API_KEY] as string,
                environment: process.env[
                    ConfigKey.PINECONE_ENVIRONMENT
                ] as string,
            });
            this.index = this.client.Index(
                process.env[ConfigKey.PINECONE_INDEX] as string,
            );
        } catch (error) {
            throw error;
        }
    }

    async createVectorStore(query: IVectorStoreQuery) {
        try {
            const vectorStore = await PineconeStore.fromExistingIndex(
                openAIEmbeddings,
                {
                    pineconeIndex: this.index,
                    filter: {
                        userId: query.userId,
                        fileId: query.fileIds?.length
                            ? { $in: query.fileIds }
                            : undefined,
                    },
                },
            );
            return vectorStore;
        } catch (error) {
            throw error;
        }
    }
}

export const pineconeData = new PineconeData();
