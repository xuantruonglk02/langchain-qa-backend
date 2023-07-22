import Joi from 'src/plugins/joi';

export enum Language {
    EN = 'en',
    VI = 'vi',
}

export enum MongoCollection {
    CONVERSATIONS = 'conversations',
    DOCUMENTS = 'documents',
    FILES = 'files',
    MESSAGES = 'messages',
    USERS = 'users',
}

export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export enum OrderBy {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
}

export const MongoOrderDirection = {
    [OrderDirection.ASC]: 1 as 1 | -1,
    [OrderDirection.DESC]: -1 as 1 | -1,
};

export const Regex = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    PASSWORD:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// form validators
export const AREA_TEXT_MAX_LENGTH = 2000;
export const ARRAY_MAX_LENGTH = 100;
export const IMAGE_URL_MAX_LENGTH = 255;
export const INPUT_TEXT_MAX_LENGTH = 255;
export const MAX_ITEM_PER_PAGE_LIMIT = 10000;
export const MIN_POSITIVE_NUMBER = 1;
export const PASSWORD_MIN_LENGTH = 8;
export const PHONE_NUMBER_MAX_LENGTH = 12;

export const DEFAULT_ITEM_PER_PAGE_LIMIT = 10;
export const DEFAULT_ORDER_BY = OrderBy.CREATED_AT;
export const DEFAULT_ORDER_DIRECTION = OrderDirection.DESC;
export const DEFAULT_FIRST_PAGE = 1;
export const HASH_PASSWORD_LENGTH = 60;
export const TIMEZONE_HEADER = 'x-timezone';
export const TIMEZONE_NAME_HEADER = 'x-timezone-name';

export const softDeleteCondition = {
    deletedAt: {
        $exists: true,
        $eq: null,
    },
};

export const commonListQuerySchemaKeys = {
    page: Joi.number().positive().optional(),
    limit: Joi.number().positive().max(MAX_ITEM_PER_PAGE_LIMIT).optional(),
    keyword: Joi.string().max(INPUT_TEXT_MAX_LENGTH).optional(),
    orderBy: Joi.string().max(INPUT_TEXT_MAX_LENGTH).optional(),
    orderDirection: Joi.string()
        .valid(...Object.values(OrderDirection))
        .optional(),
};

export const commonListQuerySchema = Joi.object().keys({
    ...commonListQuerySchemaKeys,
});
