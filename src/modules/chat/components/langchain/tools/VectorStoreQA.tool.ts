import { VectorDBQAChain } from 'langchain/chains';
import { ChainTool } from 'langchain/tools';
import { chatOpenAI } from '../models/ChatOpenAI';
import { pinecone } from '../models/Pinecone';

export class VectorStoreQATool extends ChainTool {
    constructor() {
        const vectorDBQAChain = VectorDBQAChain.fromLLM(
            chatOpenAI,
            pinecone.vectorStore,
        );

        super({
            name: 'VectorStoreQA',
            description:
                "Gives agent the ability to access and find information in user's documents.",
            chain: vectorDBQAChain,
        });
    }
}
