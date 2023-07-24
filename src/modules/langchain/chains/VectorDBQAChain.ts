import {
    VectorDBQAChain as VectorDBQAChainLangchain,
    loadQAStuffChain,
} from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { openAIModel } from '../models/OpenAI';

export class VectorDBQAChain extends VectorDBQAChainLangchain {
    constructor(vectorStore: PineconeStore) {
        const combineDocumentsChain = loadQAStuffChain(openAIModel);

        super({
            vectorstore: vectorStore,
            combineDocumentsChain,
        });
    }
}
