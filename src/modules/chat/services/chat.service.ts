import { Injectable, Logger } from '@nestjs/common';
import { chatConversationalAgent } from '../components/langchain/agents/ChatConversationAgent';

@Injectable()
export class ChatService {
    constructor(private readonly logger: Logger) {}

    async callAgent(message: string) {
        try {
            (undefined as any).a();
            const reply = await chatConversationalAgent.call(message);
            // const reply = await chatConversationalAgent2.call(message);
            return reply;
        } catch (error) {
            this.logger.error('In callAgent()', error, ChatService.name);
            throw error;
        }
    }
}
