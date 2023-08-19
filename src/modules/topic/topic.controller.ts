import { commonListQuerySchema } from '@/common/constants';
import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import { ICommonListQuery } from '@/common/interfaces';
import { JoiValidationPipe } from '@/common/pipes/joi.validation.pipe';
import { ParseObjectIdPipe } from '@/common/pipes/objectId.validation.pipe';
import { RemoveEmptyQueryPipe } from '@/common/pipes/removeEmptyQuery.pipe';
import { TrimBodyPipe } from '@/common/pipes/trimBody.pipe';
import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { TopicService } from './services/topic.service';
import { ICreateTopic } from './topic.interfaces';
import { createTopicBodySchema } from './topic.validators';

@Controller('/topic')
@UseGuards(AuthenticationGuard)
export class TopicController {
    constructor(
        private readonly logger: Logger,
        private readonly topicService: TopicService,
    ) {}

    @Get('/')
    async getTopicsList(
        @Query(
            new RemoveEmptyQueryPipe(),
            new JoiValidationPipe(commonListQuerySchema),
        )
        query: ICommonListQuery,
    ) {
        try {
            const topicList = await this.topicService.getTopicsList(query);
            return new SuccessResponse(topicList);
        } catch (error: any) {
            this.logger.error(
                'In getTopicsList()',
                error.stack,
                TopicController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Post('/')
    async createTopic(
        @Body(new TrimBodyPipe(), new JoiValidationPipe(createTopicBodySchema))
        body: ICreateTopic,
        @Req() req: any,
    ) {
        try {
            const topic = await this.topicService.createTopic(
                body,
                req.loggedUser._id,
            );
            return new SuccessResponse(topic);
        } catch (error: any) {
            this.logger.error(
                'In createTopic()',
                error.stack,
                TopicController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }

    @Delete('/:id')
    async deleteTopic(
        @Param('id', new ParseObjectIdPipe()) id: ObjectId,
        @Req() req: any,
    ) {
        try {
            const topic = await this.topicService.getTopicById(id, [
                'createdBy',
            ]);
            if (!topic) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }
            if (topic.createdBy.toString() !== req.loggedUser._id.toString()) {
                return new ErrorResponse(HttpStatus.UNPROCESSABLE_ENTITY, [
                    {
                        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                        key: 'id',
                    },
                ]);
            }

            const deletedTopic = await this.topicService.deleteTopic(
                id,
                req.loggedUser._id,
            );
            return new SuccessResponse(deletedTopic ?? {});
        } catch (error: any) {
            this.logger.error(
                'In deleteTopic()',
                error.stack,
                TopicController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
