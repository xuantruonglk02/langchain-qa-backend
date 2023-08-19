import {
    AREA_TEXT_MAX_LENGTH,
    INPUT_TEXT_MAX_LENGTH,
} from '@/common/constants';
import Joi from '@/plugins/joi';

export const createTopicBodySchema = Joi.object().keys({
    name: Joi.string().max(INPUT_TEXT_MAX_LENGTH).required(),
    description: Joi.string().max(AREA_TEXT_MAX_LENGTH).required(),
});
