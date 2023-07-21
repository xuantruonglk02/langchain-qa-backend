import { ConfigKey } from '@/common/configs/config-keys';
import {
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import url from 'url';
import { AuthService } from './services/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
        private readonly authService: AuthService,
    ) {}

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req: any) {}

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthCallback(@Req() req: any, @Res() res: Response) {
        try {
            const loginResponse = this.authService.googleLogin(req);
            if (!loginResponse) {
                throw new UnauthorizedException();
            }

            return res.status(HttpStatus.OK).redirect(
                url.format({
                    pathname: this.configService.get(
                        ConfigKey.GOOGLE_REDIRECT_URL,
                    ),
                    query: {
                        ...loginResponse.user,
                        ...loginResponse.accessToken,
                        _id: loginResponse.user._id.toString(),
                        expiresIn:
                            loginResponse.accessToken.expiresIn.toUTCString(),
                    },
                }),
            );
        } catch (error) {
            this.logger.error(
                'In googleAuthCallback()',
                error,
                AuthController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
