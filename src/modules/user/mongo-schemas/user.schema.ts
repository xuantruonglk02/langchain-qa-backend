import { MongoCollection } from '@/common/constants';
import { BaseEntity } from '@/common/mongo-schemas/base.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../user.constants';

@Schema({
    timestamps: true,
    versionKey: false,
    collection: MongoCollection.USERS,
})
export class User extends BaseEntity {
    @Prop({
        type: String,
        required: true,
    })
    email: string;

    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        enum: [...Object.values(UserRole)],
        required: true,
    })
    role: UserRole;

    @Prop({
        type: String,
        required: true,
    })
    picture: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

export const userAttributes = ['email', 'name', 'role', 'picture'];
