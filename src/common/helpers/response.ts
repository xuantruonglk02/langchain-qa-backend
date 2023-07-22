import { HttpStatus, Injectable } from '@nestjs/common';
import dotenv from 'dotenv';

dotenv.config();

const { VERSION: version = '0.0.0' } = process.env;

export interface IErrorResponse {
    key: string;
    statusCode: HttpStatus;
    message?: string;
}

export class SuccessResponse {
    constructor(data = {}, message = 'Success') {
        return {
            success: true,
            statusCode: HttpStatus.OK,
            message,
            data,
            version,
        };
    }
}

export class ErrorResponse {
    constructor(
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
        errors: IErrorResponse[],
        message = 'Error',
    ) {
        return {
            success: false,
            statusCode,
            message,
            errors,
            version,
        };
    }
}

@Injectable()
export class ApiResponse<T> {
    public statusCode: number;

    public message: string;

    public data: T;

    public errors: IErrorResponse[];
}
