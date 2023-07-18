import {
    AgentExecutor,
    initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { ConsoleCallbackHandler } from 'langchain/callbacks';
import { chatOpenAIModel } from '../models/ChatOpenAI';
import { DEFAULT_PREFIX, DEFAULT_SUFFIX } from '../prompts';
import { CalculatorTool } from '../tools/Caculator';
import { SerpAPITool } from '../tools/SerpAPI';
import { VectorStoreQATool } from '../tools/VectorStoreQA';
import { VectorStoreQATool2 } from '../tools/VectorStoreQA2';

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
                chatOpenAIModel,
                {
                    agentType: 'chat-conversational-react-description',
                    returnIntermediateSteps: true,
                    agentArgs: {
                        systemMessage: DEFAULT_PREFIX,
                        humanMessage: DEFAULT_SUFFIX,
                    },
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
