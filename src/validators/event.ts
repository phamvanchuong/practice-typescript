import * as Joi from 'joi';

export const eventValidation = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().integer().min(0).required(),
    startDate: Joi.date().greater('now').required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
}).unknown(true);

export const updateEventValidation = Joi.object({
    name: Joi.string(),
    quantity: Joi.number().integer().min(0),
    startDate: Joi.date().greater('now'),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    editing: Joi.string(),
    startEdit: Joi.date(),
});