import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationController } from './conversation.controller';
import {
    Conversation,
    ConversationSchema,
} from './mongo-schemas/conversation.schema';
import { Message, MessageSchema } from './mongo-schemas/message.schema';
import { ConversationService } from './services/conversation.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Conversation.name, schema: ConversationSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    controllers: [ConversationController],
    providers: [Logger, JwtService, ConversationService],
    exports: [ConversationService],
})
export class ConversationModule {}
