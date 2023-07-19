import { ChainTool } from 'langchain/tools';
import { VectorDBQAChain } from '../chains/VectorDBQAChain';
import { LangchainConfigs } from '../configs/configs';

export class VectorStoreQATool extends ChainTool {
    constructor() {
        const vectorDBQAChain = new VectorDBQAChain();

        super({
            name: LangchainConfigs.tools.vectorStoreQA.name,
            description: LangchainConfigs.tools.vectorStoreQA.description,
            chain: vectorDBQAChain,
        });
    }
}
