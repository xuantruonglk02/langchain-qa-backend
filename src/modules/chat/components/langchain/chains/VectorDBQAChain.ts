import {
    VectorDBQAChain as VectorDBQAChainLangchain,
    loadQARefineChain,
} from 'langchain/chains';
import { openAIModel } from '../models/OpenAI';
import { pineconeData } from '../models/PineconeData';

export class VectorDBQAChain extends VectorDBQAChainLangchain {
    constructor() {
        const combineDocumentsChain = loadQARefineChain(openAIModel);
        super({
            vectorstore: pineconeData.vectorStore,
            combineDocumentsChain,
        });
    }
}
