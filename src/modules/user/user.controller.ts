import { AuthenticationGuard } from '@/common/guards/authentication.guard';
import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import {
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';

@Controller('/user')
@UseGuards(AuthenticationGuard)
export class UserController {
    constructor(
        private readonly logger: Logger,
        private readonly userService: UserService,
    ) {}

    @Get('')
    async getUserProfile(@Req() req: any) {
        try {
            const user = await this.userService.getUserById(req.loggedUser._id);
            if (!user) {
                return new ErrorResponse(HttpStatus.NOT_FOUND, [
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }

            return new SuccessResponse(user);
        } catch (error: any) {
            this.logger.error(
                'In getUserProfile()',
                error.stack,
                UserController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
