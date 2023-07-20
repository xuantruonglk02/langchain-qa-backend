import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfigKey } from '../configs/config-keys';
import { extractToken } from '../helpers/utility-functions';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = extractToken(request.headers.authorization || '');
        if (!token) {
            throw new UnauthorizedException();
        }

        const decrypt = await this.validateToken(token);
        request.loggedUser = decrypt;
        request.accessToken = token;
        return true;
    }

    async validateToken(token: string) {
        try {
            return await this.jwtService.verify(token, {
                secret: this.configService.get(
                    ConfigKey.JWT_ACCESS_TOKEN_SECRET_KEY,
                ),
                ignoreExpiration: true,
            });
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
