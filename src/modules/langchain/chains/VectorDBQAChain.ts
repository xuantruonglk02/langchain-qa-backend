import {
    VectorDBQAChain as VectorDBQAChainLangchain,
    loadQAMapReduceChain,
} from 'langchain/chains';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { openAIModel } from '../models/OpenAI';

export class VectorDBQAChain extends VectorDBQAChainLangchain {
    constructor(vectorStore: PineconeStore) {
        const combineDocumentsChain = loadQAMapReduceChain(openAIModel);

        super({
            vectorstore: vectorStore,
            combineDocumentsChain,
        });
    }
}
