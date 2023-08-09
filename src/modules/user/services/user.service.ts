import { softDeleteCondition } from '@/common/constants';
import { ConversationService } from '@/modules/conversation/services/conversation.service';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';
import {
    User,
    UserDocument,
    userAttributes,
} from '../mongo-schemas/user.schema';
import { UserRole } from '../user.constants';
import { IUser } from '../user.interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        @InjectConnection()
        private readonly connection: Connection,
        private readonly logger: Logger,
        private readonly conversationService: ConversationService,
    ) {}

    async getUserById(id: ObjectId, attrs = userAttributes) {
        try {
            const user = await this.userModel
                .findOne({
                    _id: id,
                    ...softDeleteCondition,
                })
                .select(attrs)
                .lean();
            return user;
        } catch (error: any) {
            this.logger.error(
                'In getUserById()',
                error.stack,
                UserService.name,
            );
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
        } catch (error: any) {
            this.logger.error(
                'In getUserByEmail()',
                error.stack,
                UserService.name,
            );
            throw error;
        }
    }

    async createUserSSO(data: IUser) {
        const session = await this.connection.startSession();
        try {
            session.startTransaction();

            const users = await this.userModel.create(
                [
                    {
                        email: data.email,
                        name: data.name,
                        role: UserRole.USER,
                        picture: data.picture,
                    },
                ],
                { session },
            );
            const user = users[0];
            // TODO: create conversation in client when chat first time or when call api
            await this.conversationService.createConversation(
                { title: 'Default' },
                user._id,
                session,
            );

            await session.commitTransaction();

            return await this.getUserById(user._id);
        } catch (error: any) {
            await session.abortTransaction();
            this.logger.error(
                'In createUserSSO()',
                error.stack,
                UserService.name,
            );
            throw error;
        } finally {
            session.endSession();
        }
    }
}
