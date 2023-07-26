import { MessageType } from '@/modules/conversation/conversation.constants';
import { ConversationService } from '@/modules/conversation/services/conversation.service';
import { LangchainService } from '@/modules/langchain/langchain.service';
import { Injectable, Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IChat } from '../chat.interfaces';

@Injectable()
export class ChatService {
    constructor(
        private readonly logger: Logger,
        private readonly conversationService: ConversationService,
        private readonly langchainService: LangchainService,
    ) {}

    async callAgent(body: IChat, userId: ObjectId) {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, aiResponse] = await Promise.all([
                this.conversationService.createMessageInConversation(
                    {
                        conversationId: body.conversationId,
                        type: MessageType.USER,
                        content: body.message,
                    },
                    userId,
                ),
                this.langchainService.callAgent(
                    userId.toString(),
                    body.conversationId.toString(),
                    body.message,
                ),
            ]);
            const aiReply = aiResponse.output;
            const aiMessage =
                await this.conversationService.createMessageInConversation({
                    conversationId: body.conversationId,
                    type: MessageType.AI,
                    content: aiReply,
                    raw: JSON.stringify(aiResponse),
                });
            return aiMessage;
        } catch (error: any) {
            this.logger.error('In callAgent()', error.stack, ChatService.name);
            throw error;
        }
    }
}
