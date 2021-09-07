import { Request, ResponseToolkit } from '@hapi/hapi';

import { agenda } from '../agenda/agenda';
import { EventModel } from '../models/event';

export const createEvent = async function (req: Request, h: ResponseToolkit) {
    try {
        const { name, quantity, startDate, endDate } = req.payload;
        const checkNameEvent = await EventModel.findOne({ name });
        if (checkNameEvent) {
            return h.response({
                success: false,
                msg: 'Event existed!',
                payload: null,
            })
        }

        const newEvent = await new EventModel({ name, quantity, startDate, endDate }).save();
        await agenda.schedule(startDate, 'changeEventExpired', {
            eventId: newEvent._id,
            isExpired: false,
        });
        await agenda.schedule(endDate, 'changeEventExpired', {
            eventId: newEvent._id,
            isExpired: true,
        });
        return h.response({
            success: true,
            msg: 'Create an event successfully!',
            payload: newEvent,
        });
    } catch (error) {
        return h.response(error);
    }
};

export const checkEditingAbility = async (req: Request, h: ResponseToolkit) => {
    try {
        const { eventId }: { eventId: string } = req.params;
        const event = await EventModel.findById(eventId);
        if (!event) {
            return h.response('Event is not exist!').code(404);
        }
        const now = new Date(Date.now()),
            timeout: number = 300000;
        if (event.editing != null && event.editing != req.auth.credentials.user._id && event.startEdit != null && Date.parse(event.startEdit.toString()) + timeout >= Date.parse(now.toString())) {
            return h.response('Not allow edit!').code(409);
        }
        return h.response('Allow edit!').code(200);
    } catch (error) {
        return h.response(error);
    }
}

export const releaseEditing = async (req: Request, h: ResponseToolkit) => {
    try {
        const { eventId }: { eventId: string } = req.params;
        const event = await EventModel.findById(eventId);
        if (!event) {
            return h.response('Event is not exist!').code(404);
        }
        if (event.editing != req.auth.credentials.user._id) {
            return h.response('User is not editing!').code(400);
        }
        await EventModel.findByIdAndUpdate(eventId, { $set: { editing: null, startEdit: null } });
        return h.response('Escape editing!').code(200);
    } catch (error) {
        return h.response(error);
    }
}

export const maintainEditing = async (req: Request, h: ResponseToolkit) => {
    try {
        const { eventId }: { eventId: string } = req.params;
        const event = await EventModel.findById(eventId);
        if (!event) {
            return h.response('Event is not exist!').code(404);
        }
        if (event.editing != req.auth.credentials.user._id) {
            return h.response('User is not editing!').code(400);
        }
        await EventModel.findByIdAndUpdate(eventId, { $set: { editing: null, startEdit: null } });
        return h.response('Escape editing!').code(200);
    } catch (error) {
        return h.response(error);
    }
}

export const updateEvent = async function (req: Request, h: ResponseToolkit) {
    try {
        const { eventId }: { eventId: string } = req.params;

        const checkEvent = await EventModel.findOne({ _id: eventId });
        if (!checkEvent) {
            return h.response({
                success: false,
                msg: 'Event not exist!',
                payload: null,
            })
        }
        await EventModel.findByIdAndUpdate(eventId, { $set: { editing: req.auth.credentials.user._id, startEdit: new Date(Date.now()) } });

        // console.log(checkEvent)
        // checkEvent.set('quantity', quantity);
        // await checkEvent.save();

        const newEvent = await EventModel.findByIdAndUpdate(eventId, { $set: req.payload }, { new: true });
        return h.response({
            success: true,
            msg: 'Create an event successfully!',
            payload: newEvent,
        });
    } catch (error) {
        return h.response(error);
    }
};

export const getEvents = async (req: Request, h: ResponseToolkit) => {
    try {
        const events = await EventModel.find();
        return h.response({
            sucess: true,
            msg: 'Get list of event successfully!',
            payload: events,
        }).code(200);
    } catch (error) {
        return h.response(error);
    }
}

export const deleteEvent = async (req: Request, h: ResponseToolkit) => {
    try {
        const checkEvent = await EventModel.findOne({ _id: req.params.eventId });
        if (!checkEvent) {
            return h.response({
                sucess: true,
                msg: 'No have any event.',
                payload: null,
            });
        }
        const event = await EventModel.deleteOne({ _id: req.params.eventId });
        if (event.deletedCount == 0) {
            return {
                success: false,
                msg: 'Delete fail!',
                payload: null,
            }
        }
        return h.response({
            sucess: true,
            msg: 'Deleted an event successfully!',
            payload: null,
        }).code(200);
    } catch (error) {
        return h.response(error);
    }
}