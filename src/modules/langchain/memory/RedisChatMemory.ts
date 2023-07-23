import { ConfigKey } from '@/common/configs/config-keys';
import { getEnvFilePath } from '@/common/helpers/utility-functions';
import dotenv from 'dotenv';
import { BufferWindowMemory } from 'langchain/memory';
import { RedisChatMessageHistory } from 'langchain/stores/message/redis';
import { LangchainConfigs } from '../configs/configs';

dotenv.config({
    path: getEnvFilePath(),
});

export class RedisChatMemory extends BufferWindowMemory {
    constructor(conversationId: string) {
        super({
            chatHistory: new RedisChatMessageHistory({
                sessionId: conversationId,
                sessionTTL: LangchainConfigs.memory.redisChatMemory.sessionTTL,
                config: {
                    url: `redis://${process.env[ConfigKey.REDIS_HOST]}:${
                        process.env[ConfigKey.REDIS_PORT]
                    }`,
                },
            }),
            k: LangchainConfigs.memory.redisChatMemory.k,
            inputKey: 'input',
            outputKey: 'output',
            memoryKey: 'chat_history',
            returnMessages: true,
        });
    }
}
