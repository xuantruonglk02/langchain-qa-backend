import { Injectable, Logger } from '@nestjs/common';
import { chatConversationalAgent } from '../components/langchain/agents/ChatConversationAgent';

@Injectable()
export class ChatService {
    constructor(private readonly logger: Logger) {}

    async callAgent(message: string) {
        try {
            const reply = await chatConversationalAgent.call(message);
            return reply;
        } catch (error) {
            this.logger.error('In callAgent()', error, ChatService.name);
            throw error;
        }
    }
}
