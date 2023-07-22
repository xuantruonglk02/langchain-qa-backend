/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConfigKey } from '@/common/configs/config-keys';
import { UserService } from '@/modules/user/services/user.service';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super({
            clientID: configService.get(ConfigKey.GOOGLE_CLIENT_ID),
            clientSecret: configService.get(ConfigKey.GOOGLE_CLIENT_SECRET),
            callbackURL: configService.get(ConfigKey.GOOGLE_CALLBACK_URL),
            scope: configService.get(ConfigKey.GOOGLE_SCOPE).split(','),
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        try {
            const user = await this.userService.getUserByEmail(
                profile.emails[0].value,
            );
            if (!user) {
                const createUser = await this.userService.createUserSSO({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    picture: profile.photos[0].value,
                });
                return createUser;
            }
            return user;
        } catch (error: any) {
            this.logger.error(
                'In validate()',
                error.stack,
                GoogleStrategy.name,
            );
            throw error;
        }
    }
}
