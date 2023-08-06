import { ChainTool } from 'langchain/tools';
import { VectorDBQAChain } from '../chains/VectorDBQAChain';
import { LangchainConfigs } from '../configs/configs';
import { pineconePrinciple } from '../models/PineconePrinciple';

export class PrincipleTool extends ChainTool {
    constructor() {
        const vectorDBQAChain = new VectorDBQAChain(
            pineconePrinciple.vectorStore,
        );

        super({
            name: LangchainConfigs.tools.principle.name,
            description: LangchainConfigs.tools.principle.description,
            chain: vectorDBQAChain,
        });
    }
}
