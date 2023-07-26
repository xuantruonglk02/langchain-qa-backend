import { Injectable, Logger } from '@nestjs/common';
import { ChatConversationalAgent } from './agents/ChatConversationAgent';

@Injectable()
export class LangchainService {
    constructor(private readonly logger: Logger) {}

    async callAgent(userId: string, conversationId: string, message: string) {
        try {
            const chatAgent = new ChatConversationalAgent();
            await chatAgent.initialize({
                conversationId: conversationId,
                vectorStoreQuery: {
                    userId: userId,
                },
            });

            const aiResponse = await chatAgent.call(message);
            return aiResponse;
        } catch (error: any) {
            this.logger.error(
                'In callAgent()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }

    async censorDocument(fileId: string) {
        try {
            // TODO: check
        } catch (error: any) {
            this.logger.error(
                'In censorDocument()',
                error.stack,
                LangchainService.name,
            );
            throw error;
        }
    }
}
