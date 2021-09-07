import * as Joi from 'joi';

export const signUpUserValidation = Joi.object({
    fullName: Joi.string().description('ex: Phạm Văn Chương'),
    email: Joi.string().email().required().description('ex: chuong@gmail.com'),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required().description('password'),
    confirmPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required().description('confirm password'),
    background: Joi.string().description('Background of user'),
    isActive: Joi.boolean().description('true -> active'),
});

export const userOutput = Joi.object({
    fullName: Joi.string().description('ex: Phạm Văn Chương'),
    email: Joi.string().email().required().description('ex: chuong@gmail.com'),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required().description('password'),
    background: Joi.string().description('Background of user'),
    isActive: Joi.boolean().description('true -> active'),
}).label('bbbbbbbbbbbb');

export const signUpUserSuccess = Joi.object({
    success: Joi.boolean().required(),
    msg: Joi.string().required(),
    payload1111111111: userOutput,
}).label('aaaaaaaaaaaaaaa');

export const signUpUserError = Joi.object({
    success: Joi.boolean().required(),
    msg: Joi.string().required(),
})

export const updateUserParams = Joi.object({
    userId: Joi.string().required(),
})

export const updateUserValidation = Joi.object({
    fullName: Joi.string().description('ex: Phạm Văn Chương'),
    email: Joi.string().email().description('ex: chuong@gmail.com'),
    background: Joi.string().description('Background of user'),
});

export const signInUserValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
}).label('pvc');

export const signInUserSuccess = Joi.object({
    success: Joi.boolean().required(),
    msg: Joi.string().required(),
    payload: Joi.string(),
})