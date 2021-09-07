import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Joi from 'joi';

import { checkEditingAbility, createEvent, deleteEvent, getEvents, maintainEditing, releaseEditing, updateEvent } from '../controllers/event';
import { eventValidation, updateEventValidation } from '../validators/event';

export const eventRoutes = [
    {
        method: 'POST',
        path: '/event/create',
        handler: createEvent,
        options: {
            tags: ['api', 'event'],
            description: 'Create an event.',
            notes: 'Return an object (an event).',
            validate: {
                payload: eventValidation,
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
        },
    },
    {
        method: 'POST',
        path: '/events/{eventId}/editable/me',
        handler: checkEditingAbility,
        options: {
            tags: ['api', 'event'],
            description: 'Check the editing ability of 1 user.',
            notes: 'Return a notification.',
            auth: 'auth',
            validate: {
                params: Joi.object({
                    eventId: Joi.string().required(),
                }),
                failAction: (req: Request, h: ResponseToolkit, err: any) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
        },
    },
    {
        method: 'POST',
        path: '/events/{eventId}/editable/release',
        handler: releaseEditing,
        options: {
            tags: ['api', 'event'],
            description: 'Release edits of the current user.',
            notes: 'Return a notification.',
            auth: 'auth',
            validate: {
                params: Joi.object({
                    eventId: Joi.string().required(),
                }),
                failAction: (req: Request, h: ResponseToolkit, err: any) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).code(418).takeover();
                },
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
        },
    },
    {
        method: 'POST',
        path: '/events/{eventId}/editable/maintain',
        handler: maintainEditing,
        options: {
            tags: ['api', 'event'],
            description: 'Maintain edits of the current user.',
            notes: 'Return a notification.',
            auth: 'auth',
            validate: {
                params: Joi.object({
                    eventId: Joi.string().required(),
                }),
                failAction: (req: Request, h: ResponseToolkit, err: any) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).code(418).takeover();
                },
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
        },
    },
    {
        method: 'PUT',
        path: '/event/{eventId}',
        handler: updateEvent,
        options: {
            tags: ['api', 'event'],
            description: 'Update an event.',
            notes: 'Return an object (an event).',
            validate: {
                params: Joi.object({
                    eventId: Joi.string().required(),
                }),
                payload: updateEventValidation,
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form'
                }
            },
        },
    },
    {
        method: 'GET',
        path: '/events',
        handler: getEvents,
        options: {
            tags: ['api', 'event'],
            description: 'Get list event.',
            notes: 'Return array events.',
        }
    },
    {
        method: 'DELETE',
        path: '/event/{eventId}',
        handler: deleteEvent,
        options: {
            validate: {
                params: Joi.object({
                    eventId: Joi.string().required(),
                }),
                failAction: (req: Request, h: ResponseToolkit, err) => {
                    return h.response({
                        success: false,
                        msg: err.details,
                        payload: null,
                    }).takeover();
                },
            },
            tags: ['api', 'event'],
            description: 'Delete a event.',
            notes: 'Return message an event.',
        }
    },
]