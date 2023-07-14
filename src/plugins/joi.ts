import JoiDate from '@joi/date';
import JoiBase from 'joi';
import { ObjectId } from 'mongodb';

const joiDateExtension = (joi: any) => {
    return {
        ...JoiDate(joi),
        prepare: (value: any) => {
            if (
                value !== null &&
                value !== undefined &&
                typeof value !== 'string'
            ) {
                value = value.toString();
            }
            return { value };
        },
    };
};

const joiObjectIdExtension = (joi: any) => {
    return {
        type: 'isObjectId',
        base: joi.string(),
        validate(value: any, helpers: any) {
            if (value && !ObjectId.isValid(value)) {
                return { value, errors: helpers.error('any.invalid') };
            }
            return { value };
        },
    };
};

const Joi = JoiBase.extend(joiDateExtension, joiObjectIdExtension);
export default Joi;
