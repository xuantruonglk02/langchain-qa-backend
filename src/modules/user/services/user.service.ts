import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    User,
    UserDocument,
    userAttributes,
} from '../mongo-schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { softDeleteCondition } from '@/common/constants';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly logger: Logger,
    ) {}

    async getUserById(id: ObjectId, attrs = userAttributes) {
        try {
            const user = await this.userModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .select(attrs);
            return user;
        } catch (error) {
            this.logger.error('In getUserById()', error, UserService.name);
            throw error;
        }
    }
}
