import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { ConfigKey } from './common/configs/config-keys';
import { pineconeData } from './modules/langchain/models/PineconeData';
import { pineconePrinciple } from './modules/langchain/models/PineconePrinciple';
import './plugins/moment';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(helmet());

    const configService = app.get(ConfigService);

    const corsOptions: CorsOptions = {
        origin: (configService.get(ConfigKey.APP_CORS_WHITELIST) || '').split(
            ',',
        ),
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Language',
            'X-Timezone',
            'X-Timezone-Name',
        ],
        optionsSuccessStatus: 200,
        methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    };
    app.enableCors(corsOptions);

    // setup prefix of route
    app.setGlobalPrefix(configService.get(ConfigKey.APP_BASE_PATH) as string);
    // use winston for logger
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    await initialize();

    await app.listen(configService.get(ConfigKey.APP_PORT) as string);
}
bootstrap();

async function initialize() {
    try {
        await Promise.all([
            pineconeData.initialize(),
            pineconePrinciple.initialize(),
        ]);
    } catch (error) {
        throw error;
    }
}
