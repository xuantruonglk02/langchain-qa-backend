import moment from '@/plugins/moment';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule as NestWinstonModule } from 'nest-winston';
import winston from 'winston';
import 'winston-daily-rotate-file';
import { ConfigKey } from '../configs/config-keys';

@Module({
    imports: [
        NestWinstonModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return winston.createLogger({
                    level: configService.get(ConfigKey.LOG_LEVEL),
                    format: winston.format.json(),
                    defaultMeta: {
                        service: configService.get(ConfigKey.LOG_DEFAULT_META),
                    },
                    transports: [
                        new winston.transports.Console({
                            level: configService.get(ConfigKey.LOG_LEVEL),
                        }),
                        new winston.transports.DailyRotateFile({
                            filename: `${configService.get(
                                ConfigKey.LOG_ROOT_FOLDER,
                            )}/${configService.get(
                                ConfigKey.LOG_DEFAULT_META,
                            )}-%DATE%.log`,
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

export const createWinstonLoggerLangchain = () => {
    return winston.createLogger({
        level: 'debug',
        format: winston.format.combine(
            winston.format((info) => {
                info._time = moment().fmFullTimeStringWithTimezone();
                info.context = 'langchain';
                return info;
            })(),
            winston.format.json(),
        ),
        defaultMeta: {
            service: 'langchain-qa-backend',
        },
        transports: [
            new winston.transports.Console({
                level: 'debug',
            }),
            new winston.transports.DailyRotateFile({
                filename: `./logs.langchain/langchain-qa-backend-%DATE%.log`,
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ],
    });
};
