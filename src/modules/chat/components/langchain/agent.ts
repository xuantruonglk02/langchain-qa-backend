import {
    AgentExecutor,
    initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { chatOpenAI } from './models/ChatOpenAI';
import { CalculatorTool } from './tools/Caculator.tool';
import { SerpAPITool } from './tools/SerpAPI.tool';
import { VectorStoreQATool } from './tools/VectorStoreQA.tool';

export let agentExecutor: AgentExecutor;

export const initializeLangchainAgent = async () => {
    try {
        const tools = [
            new SerpAPITool(),
            new CalculatorTool(),
            new VectorStoreQATool(),
        ];

        agentExecutor = await initializeAgentExecutorWithOptions(
            tools,
            chatOpenAI,
            {
                agentType: 'chat-conversational-react-description',
                returnIntermediateSteps: true,
            },
        );
    } catch (error) {
        throw error;
    }
};
