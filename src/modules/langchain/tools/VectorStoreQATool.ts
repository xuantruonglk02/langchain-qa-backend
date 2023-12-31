import { ChainTool } from 'langchain/tools';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { VectorDBQAChain } from '../chains/VectorDBQAChain';
import { LangchainConfigs } from '../configs/configs';

export class VectorStoreQATool extends ChainTool {
    constructor(vectorStore: PineconeStore) {
        const vectorDBQAChain = new VectorDBQAChain(vectorStore);

        super({
            name: LangchainConfigs.tools.vectorStoreQA.name,
            description: LangchainConfigs.tools.vectorStoreQA.description,
            chain: vectorDBQAChain,
        });
    }
}
