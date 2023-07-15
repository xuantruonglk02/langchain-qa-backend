import Joi from '@/plugins/joi';

export const chatBodySchema = Joi.object().keys({
    message: Joi.string().required(),
});
