import {
    VectorDBQAChain as VectorDBQAChainLangchain,
    loadQARefineChain,
} from 'langchain/chains';
import { openAIModel } from '../models/OpenAI';
import { pineconeTruth } from '../models/PineconeTruthData';

export class VectorDBTruthQAChain extends VectorDBQAChainLangchain {
    constructor() {
        const combineDocumentsChain = loadQARefineChain(openAIModel);
        super({
            vectorstore: pineconeTruth.vectorStore,
            combineDocumentsChain,
        });
    }
}
