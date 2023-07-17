import {
    AgentExecutor,
    initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { ConsoleCallbackHandler } from 'langchain/callbacks';
import { chatOpenAI } from '../models/ChatOpenAI';
import { CalculatorTool } from '../tools/Caculator.tool';
import { SerpAPITool } from '../tools/SerpAPI.tool';
import { VectorStoreQATool } from '../tools/VectorStoreQA.tool';
import { VectorStoreQATool2 } from '../tools/VectorStoreQA2.tool';

class ChatConversationalAgent {
    private executor: AgentExecutor;

    async initialize() {
        try {
            const tools = [
                new VectorStoreQATool2(),
                new CalculatorTool(),
                new VectorStoreQATool(),
                new SerpAPITool(),
            ];

            this.executor = await initializeAgentExecutorWithOptions(
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
    }

    async call(input: string) {
        try {
            const result = await this.executor.call({ input }, [
                // new LoggingCallbackHandler('Agent'),
                new ConsoleCallbackHandler(),
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export const chatConversationalAgent = new ChatConversationalAgent();
