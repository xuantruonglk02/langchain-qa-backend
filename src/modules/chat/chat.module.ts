import { Logger, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './services/chat.service';

@Module({
    controllers: [ChatController],
    providers: [Logger, ChatService],
})
export class ChatModule {}
