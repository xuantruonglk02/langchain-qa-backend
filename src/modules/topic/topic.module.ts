import { Logger, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic, TopicSchema } from './mongo-schemas/topic.schema';
import { TopicService } from './services/topic.service';
import { TopicController } from './topic.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Topic.name, schema: TopicSchema }]),
    ],
    controllers: [TopicController],
    providers: [JwtService, Logger, TopicService],
    exports: [TopicService],
})
export class TopicModule {}
