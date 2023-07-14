import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule as NestWinstonModule } from 'nest-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigKey } from '../configs/config-keys';

export function createWinstonLogger(
    filename: string,
    configService: ConfigService,
) {
    return winston.createLogger({
        level: configService.get(ConfigKey.LOG_LEVEL),
        format: winston.format.json(),
        defaultMeta: { service: 'movie-website' },
        transports: [
            new winston.transports.Console({
                level: configService.get(ConfigKey.LOG_LEVEL),
            }),
            new winston.transports.DailyRotateFile({
                filename: `${configService.get(
                    ConfigKey.LOG_ROOT_FOLDER,
                )}/${filename}-%DATE%.log`,
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ],
    });
}

@Module({
    imports: [
        NestWinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return winston.createLogger({
                    level: configService.get(ConfigKey.LOG_LEVEL),
                    format: winston.format.json(),
                    defaultMeta: { service: 'movie-backend' },
                    transports: [
                        new winston.transports.Console({
                            level: configService.get(ConfigKey.LOG_LEVEL),
                        }),
                        new winston.transports.DailyRotateFile({
                            filename: `${configService.get(
                                ConfigKey.LOG_ROOT_FOLDER,
                            )}/movie-backend-%DATE%.log`,
                            datePattern: 'YYYY-MM-DD-HH',
                            zippedArchive: true,
                            maxSize: '20m',
                            maxFiles: '14d',
                        }),
                    ],
                });
            },
        }),
    ],
    providers: [],
})
export class WinstonModule {}
