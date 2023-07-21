import {
    DEFAULT_FIRST_PAGE,
    DEFAULT_ITEM_PER_PAGE_LIMIT,
    DEFAULT_ORDER_BY,
    DEFAULT_ORDER_DIRECTION,
    MongoOrderDirection,
    softDeleteCondition,
} from '@/common/constants';
import { ICommonListQuery } from '@/common/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { ClientSession, Model } from 'mongoose';
import {
    ICreateConversation,
    ICreateMessage,
} from '../conversation.interfaces';
import {
    Conversation,
    ConversationDocument,
    conversationAttributes,
} from '../mongo-schemas/conversation.schema';
import { Message, MessageDocument } from '../mongo-schemas/message.schema';

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(Conversation.name)
        private readonly conversationModel: Model<ConversationDocument>,
        @InjectModel(Message.name)
        private readonly messageModel: Model<MessageDocument>,
        private readonly logger: Logger,
    ) {}

    async getConversationById(id: ObjectId, attrs = conversationAttributes) {
        try {
            const conversation = await this.conversationModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .select(attrs);
            return conversation;
        } catch (error: any) {
            this.logger.error(
                'In getConversationById()',
                error.stack,
                ConversationService.name,
            );
            throw error;
        }
    }

    async getConversationsList(userId: ObjectId, query: ICommonListQuery) {
        try {
            const {
                page = DEFAULT_FIRST_PAGE,
                limit = DEFAULT_ITEM_PER_PAGE_LIMIT,
                keyword = '',
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
            } = query;
            const getListQuery: Record<string, any> = {
                createdBy: userId,
                ...softDeleteCondition,
            };
            if (keyword) {
                getListQuery.title = {
                    $regex: `.*${keyword}.*`,
                    $options: 'i',
                };
            }

            const [conversationList, total] = await Promise.all([
                this.conversationModel.aggregate([
                    { $match: getListQuery },
                    {
                        $sort: {
                            [orderBy]: MongoOrderDirection[orderDirection],
                        },
                    },
                    {
                        $skip:
                            parseInt(limit.toString()) *
                            (parseInt(page.toString()) - 1),
                    },
                    { $limit: parseInt(limit.toString()) },
                ]),
                this.conversationModel.countDocuments(getListQuery),
            ]);

            return {
                items: conversationList,
                totalItems: total,
            };
        } catch (error: any) {
            this.logger.error(
                'In getConversationsList()',
                error.stack,
                ConversationService.name,
            );
            throw error;
        }
    }

    async getMessagesList(conversationId: ObjectId, query: ICommonListQuery) {
        try {
            const {
                page = DEFAULT_FIRST_PAGE,
                limit = DEFAULT_ITEM_PER_PAGE_LIMIT,
                keyword = '',
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
            } = query;
            const getListQuery: Record<string, any> = {
                conversationId,
                ...softDeleteCondition,
            };
            if (keyword) {
                getListQuery.content = {
                    $regex: `.*${keyword}.*`,
                    $options: 'i',
                };
            }

            const [messageList, total] = await Promise.all([
                this.messageModel.aggregate([
                    { $match: getListQuery },
                    {
                        $sort: {
                            [orderBy]: MongoOrderDirection[orderDirection],
                        },
                    },
                    {
                        $skip:
                            parseInt(limit.toString()) *
                            (parseInt(page.toString()) - 1),
                    },
                    { $limit: parseInt(limit.toString()) },
                ]),
                this.messageModel.countDocuments(getListQuery),
            ]);

            return {
                items: messageList,
                totalItems: total,
            };
        } catch (error: any) {
            this.logger.error(
                'In getMessagesList()',
                error.stack,
                ConversationService.name,
            );
            throw error;
        }
    }

    async createConversation(
        data: ICreateConversation,
        userId: ObjectId,
        session: ClientSession,
    ) {
        try {
            const conversations = await this.conversationModel.create(
                [
                    {
                        title: data.title,
                        createdBy: userId,
                    },
                ],
                { session },
            );
            return conversations[0];
        } catch (error: any) {
            this.logger.error(
                'In createConversation()',
                error.stack,
                ConversationService.name,
            );
            throw error;
        }
    }

    async createMessageInConversation(data: ICreateMessage, userId?: ObjectId) {
        try {
            const messages = await this.messageModel.create([
                {
                    conversationId: new ObjectId(data.conversationId),
                    type: data.type,
                    content: data.content,
                    raw: data.raw,
                    createdBy: userId ?? null,
                },
            ]);
            return messages[0];
        } catch (error: any) {
            this.logger.error(
                'In createMessageInConversation()',
                error.stack,
                ConversationService.name,
            );
            throw error;
        }
    }
}
