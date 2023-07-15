import Joi from '@/plugins/joi';
import { DocumentExtension } from '../file/file.constants';

export const createDocumentBodySchema = Joi.object().keys({
    name: Joi.string().required(),
});
export const getUrlUploadDocumentQuerySchema = Joi.object().keys({
    fileExtension: Joi.string()
        .valid(...Object.values(DocumentExtension))
        .required(),
});
export const confirmDocumentUploadedBodySchema = Joi.object().keys({
    fileId: Joi.isObjectId().required(),
    fileKey: Joi.string().required(),
});
