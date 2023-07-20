import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { SuccessResponse } from '@/common/helpers/response';
import { JoiValidationPipe } from '@/common/pipes/joi.validation.pipe';
import { TrimBodyPipe } from '@/common/pipes/trimBody.pipe';
import {
    Body,
    Controller,
    InternalServerErrorException,
    Logger,
    Post,
    UseGuards,
} from '@nestjs/common';
import { IChat } from './chat.interfaces';
import { chatBodySchema } from './chat.validators';
import { ChatService } from './services/chat.service';

@Controller('/chat')
@UseGuards(AuthenticationGuard)
export class ChatController {
    constructor(
        private readonly logger: Logger,
        private readonly chatService: ChatService,
    ) {}

    @Post('/')
    async chat(
        @Body(new TrimBodyPipe(), new JoiValidationPipe(chatBodySchema))
        body: IChat,
    ) {
        try {
            const response = await this.chatService.callAgent(body.message);
            return new SuccessResponse({
                ...response,
                reply: response.output,
            });
        } catch (error) {
            this.logger.error('In chat()', error, ChatController.name);
            throw new InternalServerErrorException(error);
        }
    }
}
