import Joi from '@/plugins/joi';

export const chatBodySchema = Joi.object().keys({
    conversationId: Joi.isObjectId().required(),
    message: Joi.string().required(),
});
