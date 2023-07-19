import { ChainTool } from 'langchain/tools';
import { VectorDBTruthQAChain } from '../chains/VectorDBTruthQAChain';
import { LangchainConfigs } from '../configs/configs';

export class TruthQATool extends ChainTool {
    constructor() {
        const vectorDBQAChain = new VectorDBTruthQAChain();

        super({
            name: LangchainConfigs.tools.truthQA.name,
            description: LangchainConfigs.tools.truthQA.description,
            chain: vectorDBQAChain,
        });
    }
}
