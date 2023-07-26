import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConversationModule } from '../conversation/conversation.module';
import { LangchainModule } from '../langchain/langchain.module';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';

@Module({
    imports: [ConversationModule, LangchainModule],
    controllers: [ChatController],
    providers: [Logger, JwtService, ChatService],
})
export class ChatModule {}
