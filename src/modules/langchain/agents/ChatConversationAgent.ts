import {
    AgentExecutor,
    initializeAgentExecutorWithOptions,
} from 'langchain/agents';
import { LoggingCallbackHandler } from '../callbacks/LoggingCallbackHandler';
import {
    CHAT_CONVERSATION_AGENT_HUMAN_MESSAGE,
    CHAT_CONVERSATION_AGENT_SYSTEM_MESSAGE,
} from '../configs/prompts';
import { IInitializeAgentOptions } from '../langchain.interfaces';
import { RedisChatMemory } from '../memory/RedisChatMemory';
import { chatOpenAIModel } from '../models/ChatOpenAI';
import { pineconeData } from '../models/PineconeData';
import { CalculatorTool } from '../tools/CalculatorTool';
import { VectorStoreQATool } from '../tools/VectorStoreQATool';

export class ChatConversationalAgent {
    private executor: AgentExecutor;

    async initialize(options: IInitializeAgentOptions) {
        try {
            const memory = new RedisChatMemory(options.conversationId);
            const vectorStore = await pineconeData.createVectorStore(
                options.vectorStoreQuery,
            );

            const tools = [
                // new Constitution(),
                new CalculatorTool(),
                new VectorStoreQATool(vectorStore),
                // new TruthQATool(),
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
                    memory: memory,
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
