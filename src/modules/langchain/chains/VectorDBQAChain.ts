import {
    VectorDBQAChain as VectorDBQAChainLangchain,
    loadQARefineChain,
} from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { openAIModel } from '../models/OpenAI';

export class VectorDBQAChain extends VectorDBQAChainLangchain {
    constructor(vectorStore: PineconeStore) {
        const combineDocumentsChain = loadQARefineChain(openAIModel);

        super({
            vectorstore: vectorStore,
            combineDocumentsChain,
        });
    }
}
