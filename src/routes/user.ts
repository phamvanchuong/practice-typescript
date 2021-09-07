import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from 'joi';

import { getUser, getUsers, index, updateUser, signup, signin, deleteUser } from '../controllers/user';
import { signInUserSuccess, signInUserValidation, signUpUserError, signUpUserValidation, updateUserParams, updateUserValidation } from '../validators/user';

export const userRoutes = [
    {
        method: 'GET',
        path: '/',
        handler: index,
        options: {
            tags: ['api'],
            description: 'index page.',
            notes: 'Return string.',
        }
    },
    {
        method: 'POST',
        path: '/signup',
        handler: signup,
        options: {
            validate: {
                payload: signUpUserValidation,
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details.message,
                        payload: null,
                    }).code(400).takeover();
                },
            },
            tags: ['api', 'user'],
            description: 'sign up a user',
            notes: 'Return a user.',
            plugins: {
                'hapi-swagger': {
                    // payloadType: 'form',
                    // responses: {
                    //     '200': {
                    //         description: 'Success!',
                    //         schema: signUpUserSuccess,
                    //     },
                    //     '400': {
                    //         description: 'Validate error!',
                    //         schema: signUpUserError,
                    //     },
                    //     '500': {
                    //         description: 'Error!',
                    //         schema: signUpUserError,
                    //     }
                    // }
                }
            },
        },
    },
    {
        method: 'POST',
        path: '/signin',
        handler: signin,
        options: {
            validate: {
                payload: signInUserValidation,
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details.message,
                        payload: null,
                    }).code(400).takeover();
                },
            },
            tags: ['api', 'user'],
            description: 'sign in a user',
            notes: 'Return a token.',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    responses: {
                        '200': {
                            description: 'Success!',
                            schema: signInUserSuccess,
                        },
                        '400': {
                            description: 'Validate error!',
                            schema: signUpUserError,
                        },
                        '500': {
                            description: 'Error!',
                            schema: signUpUserError,
                        },
                    },
                },
            },
        },
    },
    {
        method: 'PUT',
        path: '/user/{userId}',
        handler: updateUser,
        options: {
            validate: {
                headers: Joi.object({
                    authorization: Joi.string()
                }),
                options: {
                    allowUnknown: true
                },
                params: updateUserParams,
                payload: updateUserValidation,
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details.message,
                        payload: null,
                    }).code(400).takeover();
                },
            },
            tags: ['api', 'user'],
            description: 'Update info of a user.',
            notes: 'Return info of user updated.',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    // responses: {
                    //     '200': {
                    //         description: 'Success!',
                    //         schema: signUpUserSuccess,
                    //     },
                    //     '400': {
                    //         description: 'Validate error!',
                    //         schema: signUpUserError,
                    //     },
                    //     '500': {
                    //         description: 'Error!',
                    //         schema: signUpUserError,
                    //     }
                    // }
                }
            },
        },
    },
    {
        method: 'GET',
        path: '/user/{userId}',
        handler: getUser,
        options: {
            validate: {
                headers: Joi.object({
                    authorization: Joi.string()
                }),
                options: {
                    allowUnknown: true
                },
                params: Joi.object({
                    userId: Joi.string().required()
                }),
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            tags: ['api', 'user'],
            description: 'get a user by id.',
            notes: 'Return a user.',
            auth: 'auth',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    // responses: {
                    //     '200': {
                    //         description: 'Success!',
                    //         schema: signUpUserSuccess,
                    //     },
                    //     '400': {
                    //         description: 'Validate error!',
                    //         schema: signUpUserError,
                    //     },
                    //     '500': {
                    //         description: 'Error!',
                    //         schema: signUpUserError,
                    //     }
                    // }
                }
            },
        },
    },
    {
        method: 'GET',
        path: '/users',
        handler: getUsers,
        options: {
            validate: {
                headers: Joi.object({
                    authorization: Joi.string()
                }).unknown(), //hoặc .options({allowUnknown: true})
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            tags: ['api', 'user'],
            description: 'get list user.',
            notes: 'Return an array of users.',
            auth: 'auth',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    // responses: {
                    //     '200': {
                    //         description: 'Success!',
                    //         schema: signUpUserSuccess,
                    //     },
                    //     '400': {
                    //         description: 'Validate error!',
                    //         schema: signUpUserError,
                    //     },
                    //     '500': {
                    //         description: 'Error!',
                    //         schema: signUpUserError,
                    //     }
                    // }
                }
            },
        },
    },
    {
        method: 'DELETE',
        path: '/user/{userId}',
        handler: deleteUser,
        options: {
            validate: {
                headers: Joi.object({
                    authorization: Joi.string()
                }),
                options: {
                    allowUnknown: true
                },
                params: Joi.object({
                    userId: Joi.string().required()
                }),
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            tags: ['api', 'user'],
            description: 'Delete a user.',
            notes: 'Return message deleted successful.',
            auth: 'auth',
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                    // responses: {
                    //     '200': {
                    //         description: 'Success!',
                    //         schema: signUpUserSuccess,
                    //     },
                    //     '400': {
                    //         description: 'Validate error!',
                    //         schema: signUpUserError,
                    //     },
                    //     '500': {
                    //         description: 'Error!',
                    //         schema: signUpUserError,
                    //     }
                    // }
                }
            },
        },
    },

]