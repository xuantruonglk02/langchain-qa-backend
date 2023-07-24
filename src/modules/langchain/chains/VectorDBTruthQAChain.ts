import {
    VectorDBQAChain as VectorDBQAChainLangchain,
    loadQAMapReduceChain,
} from 'langchain/chains';
import { openAIModel } from '../models/OpenAI';
import { pineconeTruth } from '../models/PineconeTruthData';

export class VectorDBTruthQAChain extends VectorDBQAChainLangchain {
    constructor() {
        const combineDocumentsChain = loadQAMapReduceChain(openAIModel);
        super({
            vectorstore: pineconeTruth.vectorStore,
            combineDocumentsChain,
        });
    }
}
