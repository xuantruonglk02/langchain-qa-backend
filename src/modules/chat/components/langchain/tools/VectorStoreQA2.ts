import { VectorDBQAChain } from 'langchain/chains';
import { ChainTool } from 'langchain/tools';
import { LangchainConfigs } from '../configs/configs';
import { chatOpenAIModel } from '../models/ChatOpenAI';
import { pineconePD } from '../models/PineconeProhibitedData';

export class VectorStoreQATool2 extends ChainTool {
    constructor() {
        const vectorDBQAChain = VectorDBQAChain.fromLLM(
            chatOpenAIModel,
            pineconePD.vectorStore,
        );

        super({
            name: LangchainConfigs.tools.vectorStoreBannedContent.name,
            description:
                LangchainConfigs.tools.vectorStoreBannedContent.description,
            chain: vectorDBQAChain,
        });
    }
}
