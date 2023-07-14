import { HttpStatus, Injectable } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();

const { VERSION: version = '1.0.0' } = process.env;

export interface IErrorResponse {
    key: string;
    code: HttpStatus;
    message?: string;
}

export class SuccessResponse {
    constructor(data = {}, message = 'DEFAULT_SUCCESS_MESSAGE') {
        return {
            success: true,
            code: HttpStatus.OK,
            message,
            data,
            version,
        };
    }
}

export class ErrorResponse {
    constructor(
        code = HttpStatus.INTERNAL_SERVER_ERROR,
        errors: IErrorResponse[],
        message = 'DEFAULT_ERROR_MESSAGE',
    ) {
        return {
            success: false,
            code,
            message,
            errors,
            version,
        };
    }
}

@Injectable()
export class ApiResponse<T> {
    public code: number;

    public message: string;

    public data: T;

    public errors: IErrorResponse[];
}
