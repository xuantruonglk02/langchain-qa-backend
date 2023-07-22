import { ConfigKey } from '@/common/configs/config-keys';
import { IUser } from '@/modules/user/user.interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import moment from 'moment';

@Injectable()
export class AuthService {
    constructor(
        private readonly logger: Logger,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    generateAccessToken(user: IUser) {
        try {
            const secretAccessTokenKey = this.configService.get(
                ConfigKey.JWT_ACCESS_TOKEN_SECRET_KEY,
            );
            const accessTokenExpiresIn = this.configService.get(
                ConfigKey.JWT_ACCESS_TOKEN_EXPIRES_IN,
            );
            const accessTokenOptions = {
                secret: secretAccessTokenKey,
                expiresIn: accessTokenExpiresIn,
            };
            const accessTokenPayload = {
                ...user,
                expiresIn: moment(new Date())
                    .add(parseInt(accessTokenExpiresIn), 'milliseconds')
                    .toDate(),
            };
            const accessToken = this.jwtService.sign(
                accessTokenPayload,
                accessTokenOptions,
            );
            return {
                token: accessToken,
                expiresIn: moment(new Date())
                    .add(parseInt(accessTokenExpiresIn), 'milliseconds')
                    .toDate(),
            };
        } catch (error: any) {
            this.logger.error(
                'In generateAccessToken()',
                error.stack,
                AuthService.name,
            );
            throw error;
        }
    }

    generateRefreshToken(user: IUser) {
        try {
            const secretRefreshTokenKey = this.configService.get(
                ConfigKey.JWT_REFRESH_TOKEN_SECRET_KEY,
            );
            const refreshTokenExpiresIn = this.configService.get(
                ConfigKey.JWT_REFRESH_TOKEN_EXPIRES_IN,
            );
            const refreshTokenOptions = {
                secret: secretRefreshTokenKey,
                expiresIn: refreshTokenExpiresIn,
            };
            const refreshTokenPayload = {
                ...user,
                expiresIn: moment(new Date())
                    .add(parseInt(refreshTokenExpiresIn), 'milliseconds')
                    .toDate(),
            };
            const refreshToken = this.jwtService.sign(
                refreshTokenPayload,
                refreshTokenOptions,
            );
            return {
                token: refreshToken,
                expiresIn: moment(new Date())
                    .add(parseInt(refreshTokenExpiresIn), 'milliseconds')
                    .toDate(),
            };
        } catch (error: any) {
            this.logger.error(
                'In generateRefreshToken()',
                error.stack,
                AuthService.name,
            );
            throw error;
        }
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            const decrypt = await this.jwtService.verify(refreshToken, {
                secret: this.configService.get(
                    ConfigKey.JWT_REFRESH_TOKEN_SECRET_KEY,
                ),
                ignoreExpiration: true,
            });
            if (decrypt?._id) {
                return decrypt;
            } else {
                return null;
            }
        } catch (error: any) {
            this.logger.error(
                'In verifyRefreshToken()',
                error.stack,
                AuthService.name,
            );
            throw error;
        }
    }

    googleLogin(req: any) {
        try {
            if (!req.user) {
                return null;
            }
            const accessToken = this.generateAccessToken(req.user);
            return {
                user: req.user,
                accessToken,
            };
        } catch (error: any) {
            this.logger.error(
                'In googleLogin()',
                error.stack,
                AuthService.name,
            );
            throw error;
        }
    }
}
