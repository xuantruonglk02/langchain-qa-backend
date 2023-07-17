import { VectorDBQAChain } from 'langchain/chains';
import { ChainTool } from 'langchain/tools';
import { chatOpenAI } from '../models/ChatOpenAI';
import { pineconePD } from '../models/PineconeProhibitedData';

export class VectorStoreQATool2 extends ChainTool {
    constructor() {
        const vectorDBQAChain = VectorDBQAChain.fromLLM(
            chatOpenAI,
            pineconePD.vectorStore,
        );

        super({
            name: 'VectorStoreBannedContent',
            description:
                "Gives agent the ability to access and find the banned information. You must not talk about any of the information contained herein. If a user's question involves forbidden information, notify them that their question is not allowed. Use this tool first to determine if a user's question is prohibited content.",
            chain: vectorDBQAChain,
        });
    }
}
