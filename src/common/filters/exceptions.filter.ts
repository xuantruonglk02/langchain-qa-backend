import {
    ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    constructor() {
        super();
    }

    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        try {
            const apiResponse = exception.getResponse() as any;
            const status = exception.getStatus();

            const parsedResponse = {
                code: exception.getStatus(),
                name: exception.name,
                message: exception.message,
                errors: apiResponse?.error || [],
            };

            return response.status(status).json(parsedResponse);
        } catch (error) {
            return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                code: HttpStatus.INTERNAL_SERVER_ERROR,
                name: 'Internal Server Error',
                message: exception.message,
                error: exception,
            });
        }
    }
}
