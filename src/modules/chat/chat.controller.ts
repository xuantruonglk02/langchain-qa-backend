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
    Req,
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
        @Req() req: any,
    ) {
        try {
            const aiMessage = await this.chatService.callAgent(
                body,
                req.loggedUser._id,
            );
            return new SuccessResponse(aiMessage);
        } catch (error) {
            this.logger.error('In chat()', error, ChatController.name);
            throw new InternalServerErrorException(error);
        }
    }
}
