import {
    AgentExecutor,
    ChatConversationalAgent as ChatConversationalAgentLangchain,
} from 'langchain/agents';
import { ConsoleCallbackHandler } from 'langchain/callbacks';
import { ConversationChain } from 'langchain/chains';
import { BufferMemory } from 'langchain/memory';
import { chatOpenAIModel } from '../models/ChatOpenAI';
import { DEFAULT_PREFIX, DEFAULT_SUFFIX } from '../prompts';
import { CalculatorTool } from '../tools/Caculator';
import { SerpAPITool } from '../tools/SerpAPI';
import { VectorStoreQATool } from '../tools/VectorStoreQA';
import { VectorStoreQATool2 } from '../tools/VectorStoreQA2';

const tools = [
    new CalculatorTool(),
    new SerpAPITool(),
    new VectorStoreQATool(),
    new VectorStoreQATool2(),
];

class ChatConversationalAgent2 {
    private readonly agent: ChatConversationalAgentLangchain;
    private executor: AgentExecutor;

    constructor() {
        const prompt = ChatConversationalAgentLangchain.createPrompt(tools, {
            systemMessage: DEFAULT_PREFIX,
            humanMessage: DEFAULT_SUFFIX,
        });
        const llmChain = new ConversationChain({
            llm: chatOpenAIModel,
            prompt: prompt,
            memory: new BufferMemory({
                returnMessages: true,
                memoryKey: 'history',
            }),
        });
        this.agent = new ChatConversationalAgentLangchain({
            llmChain,
        });
    }

    async initialize() {
        try {
            const tools = [
                new VectorStoreQATool2(),
                new CalculatorTool(),
                new VectorStoreQATool(),
                // new SerpAPITool(),
            ];
            this.executor = AgentExecutor.fromAgentAndTools({
                agent: this.agent,
                tools,
            });
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
export const chatConversationalAgent2 = new ChatConversationalAgent2();
