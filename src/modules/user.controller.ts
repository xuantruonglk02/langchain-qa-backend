import { ErrorResponse, SuccessResponse } from '@/common/helpers/response';
import {
    Controller,
    Get,
    HttpStatus,
    InternalServerErrorException,
    Logger,
    Req,
} from '@nestjs/common';
import { UserService } from './user/services/user.service';

@Controller('/user')
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
                        code: HttpStatus.NOT_FOUND,
                        key: 'id',
                    },
                ]);
            }

            return new SuccessResponse(user);
        } catch (error) {
            this.logger.error(
                'In getUserProfile()',
                error,
                UserController.name,
            );
            throw new InternalServerErrorException(error);
        }
    }
}
