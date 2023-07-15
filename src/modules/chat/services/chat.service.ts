import { Injectable, Logger } from '@nestjs/common';
import { agentExecutor } from '../components/langchain/agent';

@Injectable()
export class ChatService {
    constructor(private readonly logger: Logger) {}

    async callAgent(message: string) {
        try {
            const reply = await agentExecutor.call({ input: message }, [
                // new LoggingCallbackHandler('Agent'),
            ]);
            return reply;
        } catch (error) {
            this.logger.error('In callAgent()', error, ChatService.name);
            throw error;
        }
    }
}
