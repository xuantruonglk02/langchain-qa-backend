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
                'Gives agent the ability to access and find prohibited content.',
            chain: vectorDBQAChain,
        });
    }
}
