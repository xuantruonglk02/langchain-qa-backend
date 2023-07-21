import { MessageType } from '@/modules/conversation/conversation.constants';
import { ConversationService } from '@/modules/conversation/services/conversation.service';
import { Injectable, Logger } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { IChat } from '../chat.interfaces';
import { chatConversationalAgent } from '../../langchain/agents/ChatConversationAgent';

@Injectable()
export class ChatService {
    constructor(
        private readonly logger: Logger,
        private readonly conversationService: ConversationService,
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
                chatConversationalAgent.call(body.message),
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
        } catch (error) {
            this.logger.error('In callAgent()', error, ChatService.name);
            throw error;
        }
    }
}
