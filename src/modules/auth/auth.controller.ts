import {
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './services/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly logger: Logger,
        private readonly authService: AuthService,
    ) {}

    @Get('/google')
    @UseGuards(AuthGuard('google'))
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    async googleAuth(@Req() req: any) {}

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    googleAuthCallback(@Req() req: any) {
        try {
            return this.authService.googleLogin(req);
        } catch (error) {
            this.logger.error(
                'In googleAuthCallback()',
                error,
                AuthController.name,
            );
            console.log(error);
            throw new InternalServerErrorException(error);
        }
    }
}
