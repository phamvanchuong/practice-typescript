import * as Joi from 'joi';

export const voucherValidation = Joi.object({
    eventId: Joi.string().required(),
    email: Joi.string().email().required(),
})