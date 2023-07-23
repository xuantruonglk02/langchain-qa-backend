import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import { JoiValidationPipe } from '@/common/pipes/joi.validation.pipe';
import { TrimBodyPipe } from '@/common/pipes/trimBody.pipe';
import {
    Body,
    Controller,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ConversationService } from '../conversation/services/conversation.service';
import { IChat } from './chat.interfaces';
import { chatBodySchema } from './chat.validators';
import { ChatService } from './services/chat.service';

@Controller('/chat')
@UseGuards(AuthenticationGuard)
export class ChatController {
    constructor(
        private readonly logger: Logger,
        private readonly chatService: ChatService,
        private readonly conversationService: ConversationService,
    ) {}

    @Post('/')
    async chat(
        @Body(new TrimBodyPipe(), new JoiValidationPipe(chatBodySchema))
        body: IChat,
        @Req() req: any,
    ) {
        try {
            const conversation =
                await this.conversationService.getConversationById(
                    new ObjectId(body.conversationId),
                    ['createdBy'],
                );
            if (!conversation) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'conversationId',
                    },
                ]);
            }
            if (
                req.loggedUser._id.toString() !==
                conversation.createdBy.toString()
            ) {
                return new ErrorResponse(HttpStatus.FORBIDDEN, [
                    {
                        statusCode: HttpStatus.FORBIDDEN,
                        key: 'conversationId',
                    },
                ]);
            }

            const aiMessage = await this.chatService.callAgent(
                body,
                req.loggedUser._id,
            );
            return new SuccessResponse(aiMessage);
        } catch (error: any) {
            this.logger.error('In chat()', error.stack, ChatController.name);
            throw new InternalServerErrorException(error);
        }
    }
}
