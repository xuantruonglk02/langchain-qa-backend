import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationModule } from '../conversation/conversation.module';
import { User, UserSchema } from './mongo-schemas/user.schema';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ConversationModule,
    ],
    controllers: [UserController],
    providers: [Logger, JwtService, UserService],
    exports: [UserService],
})
export class UserModule {}
