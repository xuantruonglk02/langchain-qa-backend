import { MiddlewareConsumer, Module, NestModule, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import mongoose from 'mongoose';
import { AppController } from './app.controller';
import { ConfigKey } from './common/configs/config-keys';
import { AllExceptionsFilter } from './common/filters/exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HeaderMiddleware } from './common/middleware/header.middleware';
import { MongoModule } from './common/modules/mongo.module';
import { WinstonModule } from './common/modules/winston.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { DocumentModule } from './modules/document/document.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        MongoModule,
        WinstonModule,
        AuthModule,
        ChatModule,
        DocumentModule,
        UserModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            scope: Scope.REQUEST,
            useClass: AllExceptionsFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformInterceptor,
        },
    ],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HeaderMiddleware).forRoutes('*');
        mongoose.set(
            'debug',
            process.env[ConfigKey.MONGODB_DEBUG] === 'enable',
        );
    }
}
