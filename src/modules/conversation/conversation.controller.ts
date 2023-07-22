import { commonListQuerySchema } from '@/common/constants';
import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { SuccessResponse } from '@/common/helpers/response';
import { ICommonListQuery } from '@/common/interfaces';
import { JoiValidationPipe } from '@/common/pipes/joi.validation.pipe';
import { ParseObjectIdPipe } from '@/common/pipes/objectId.validation.pipe';
import { RemoveEmptyQueryPipe } from '@/common/pipes/removeEmptyQuery.pipe';
import {
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { ConversationService } from './services/conversation.service';

@Controller('/conversation')
@UseGuards(AuthenticationGuard)
export class ConversationController {
    constructor(
        private readonly logger: Logger,
        private readonly conversationService: ConversationService,
    ) {}

    @Get('/')
    async getConversationsList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(commonListQuerySchema),
        )
        query: ICommonListQuery,
        @Req() req: any,
    ) {
        try {
            const listResponse =
                await this.conversationService.getConversationsList(
                    req.loggedUser._id,
                    query,
                );
            return new SuccessResponse(listResponse);
        } catch (error: any) {
            this.logger.error(
                'In getConversationsList()',
                error.stack,
                ConversationController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Get('/:id/message')
    async getMessagesList(
        @Param('id', new ParseObjectIdPipe()) id: ObjectId,
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(commonListQuerySchema),
        )
        query: ICommonListQuery,
    ) {
        try {
            const listResponse = await this.conversationService.getMessagesList(
                id,
                query,
            );
            return new SuccessResponse(listResponse);
        } catch (error: any) {
            this.logger.error(
                'In getMessagesList()',
                error.stack,
                ConversationController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
