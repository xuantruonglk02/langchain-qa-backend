import { softDeleteCondition } from '@/common/constants';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import {
    User,
    UserDocument,
    userAttributes,
} from '../mongo-schemas/user.schema';
import { IUser } from '../user.interfaces';

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

    async getUserByEmail(email: string, attrs = userAttributes) {
        try {
            const user = await this.userModel
                .findOne({
                    email,
                    ...softDeleteCondition,
                })
                .select(attrs)
                .lean();
            return user;
        } catch (error) {
            this.logger.error('In getUserByEmail()', error, UserService.name);
            throw error;
        }
    }

    async createUserSSO(data: IUser) {
        try {
            const users = await this.userModel.create([
                {
                    email: data.email,
                    name: data.name,
                    picture: data.picture,
                },
            ]);
            return users[0];
        } catch (error) {
            this.logger.error('In createUserSSO()', error, UserService.name);
            throw error;
        }
    }
}
