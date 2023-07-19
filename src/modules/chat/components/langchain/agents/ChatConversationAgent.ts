import {
    AgentExecutor,
    initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { LoggingCallbackHandler } from '../callbacks/LoggingCallbackHandler';
import {
    CHAT_CONVERSATION_AGENT_HUMAN_MESSAGE,
    CHAT_CONVERSATION_AGENT_SYSTEM_MESSAGE,
} from '../configs/prompts';
import { chatOpenAIModel } from '../models/ChatOpenAI';
import { CalculatorTool } from '../tools/Calculator';
import { Constitution } from '../tools/Constitution';
import { VectorStoreQATool } from '../tools/VectorStoreQA';

class ChatConversationalAgent {
    private executor: AgentExecutor;

    async initialize() {
        try {
            const tools = [
                new Constitution(),
                new CalculatorTool(),
                new VectorStoreQATool(),
                // new SerpAPITool(),
            ];

            this.executor = await initializeAgentExecutorWithOptions(
                tools,
                chatOpenAIModel,
                {
                    agentType: 'chat-conversational-react-description',
                    returnIntermediateSteps: true,
                    agentArgs: {
                        systemMessage: CHAT_CONVERSATION_AGENT_SYSTEM_MESSAGE,
                        humanMessage: CHAT_CONVERSATION_AGENT_HUMAN_MESSAGE,
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
                new LoggingCallbackHandler(),
            ]);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export const chatConversationalAgent = new ChatConversationalAgent();
