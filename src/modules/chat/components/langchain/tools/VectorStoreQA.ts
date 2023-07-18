import { ChainTool } from 'langchain/tools';
import { VectorDBQAChain } from '../chains/VectorDBQAChain';

export class VectorStoreQATool extends ChainTool {
    constructor() {
        const vectorDBQAChain = new VectorDBQAChain();

        super({
            name: 'VectorStoreQA',
            description:
                "Gives agent the ability to access and find information in user's documents.",
            chain: vectorDBQAChain,
        });
    }
}
