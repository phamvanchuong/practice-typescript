import * as Joi from 'joi';

export const responseValidation = Joi.object({
    success: Joi.boolean().required(),
    msg: Joi.string().required(),
    payload: Joi.object(),
})