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
import { Model } from 'mongoose';
import {
    Topic,
    TopicDocument,
    topicAttributes,
} from '../mongo-schemas/topic.schema';
import { ICreateTopic, IUpdateTopic } from '../topic.interfaces';

@Injectable()
export class TopicService {
    constructor(
        @InjectModel(Topic.name)
        private readonly topicModel: Model<TopicDocument>,
        private readonly logger: Logger,
    ) {}

    async getTopicById(id: ObjectId, attrs = topicAttributes) {
        try {
            const topic = await this.topicModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .select(attrs)
                .lean();
            return topic;
        } catch (error: any) {
            this.logger.error(
                'In getTopicById()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }

    async getTopicsByIds(ids: ObjectId[], attrs = topicAttributes) {
        try {
            const topics = await this.topicModel
                .find({
                    _id: { $in: ids },
                    ...softDeleteCondition,
                })
                .select(attrs)
                .lean();
            return topics;
        } catch (error: any) {
            this.logger.error(
                'In getTopicsByIds()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }

    async getTopicsList(query: ICommonListQuery) {
        try {
            const {
                page = DEFAULT_FIRST_PAGE,
                limit = DEFAULT_ITEM_PER_PAGE_LIMIT,
                keyword = '',
                orderBy = DEFAULT_ORDER_BY,
                orderDirection = DEFAULT_ORDER_DIRECTION,
            } = query;
            const getListQuery: Record<string, any> = {
                ...softDeleteCondition,
            };
            if (keyword) {
                getListQuery.name = {
                    $regex: `.*${keyword}.*`,
                    $options: 'i',
                };
            }

            const [topicList, total] = await Promise.all([
                this.topicModel.aggregate([
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
                this.topicModel.countDocuments(getListQuery),
            ]);

            return {
                items: topicList,
                totalItems: total,
            };
        } catch (error: any) {
            this.logger.error(
                'In getTopicsList()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }

    async checkAllTopicsExist(ids: ObjectId[]) {
        try {
            const topics = await this.topicModel
                .find({
                    _id: { $in: ids },
                    ...softDeleteCondition,
                })
                .select(['_id']);
            return topics.length === ids.length;
        } catch (error: any) {
            this.logger.error(
                'In checkAllTopicsExist()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }

    async createTopic(data: ICreateTopic, userId: ObjectId) {
        try {
            const topics = await this.topicModel.create([
                {
                    name: data.name,
                    description: data.description,
                    createdBy: userId,
                },
            ]);
            return topics[0];
        } catch (error: any) {
            this.logger.error(
                'In createTopic()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }

    async updateTopic(id: ObjectId, data: IUpdateTopic, userId: ObjectId) {
        try {
            await this.topicModel.updateOne(
                {
                    _id: id,
                    ...softDeleteCondition,
                },
                {
                    $set: {
                        name: data.name,
                        description: data.description,
                        updatedBy: userId,
                    },
                },
            );

            return await this.getTopicById(id);
        } catch (error: any) {
            this.logger.error(
                'In updateTopic()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }

    async deleteTopic(id: ObjectId, userId: ObjectId) {
        try {
            const topic = await this.topicModel.findOneAndUpdate(
                {
                    _id: id,
                    ...softDeleteCondition,
                },
                {
                    $set: {
                        deletedAt: new Date(),
                        deletedBy: userId,
                    },
                },
                {
                    new: true,
                },
            );
            return topic;
        } catch (error: any) {
            this.logger.error(
                'In deleteTopic()',
                error.stack,
                TopicService.name,
            );
            throw error;
        }
    }
}
