import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';

@Module({
    controllers: [ChatController],
    providers: [Logger, JwtService, ChatService],
})
export class ChatModule {}
