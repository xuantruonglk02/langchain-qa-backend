import { VectorDBQAChain } from 'langchain/chains';
import { ChainTool } from 'langchain/tools';
import { chatOpenAIModel } from '../models/ChatOpenAI';
import { pineconePD } from '../models/PineconeProhibitedData';

export class VectorStoreQATool2 extends ChainTool {
    constructor() {
        const vectorDBQAChain = VectorDBQAChain.fromLLM(
            chatOpenAIModel,
            pineconePD.vectorStore,
        );

        super({
            name: 'VectorStoreBannedContent',
            description:
                'You must use this tool first to check user questions for policy violations',
            chain: vectorDBQAChain,
        });
    }
}
