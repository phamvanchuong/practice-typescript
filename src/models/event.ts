import * as mongoose from 'mongoose';

interface IEvent {
    name: String,
    quantity: Number,
    startDate: Date,
    endDate: Date,
    isExpired: Boolean,
    editing: String,
    startEdit: Date,
}

const EventSchema = new mongoose.Schema<IEvent>({
    name: String,
    quantity: Number,
    startDate: Date,
    endDate: Date,
    isExpired: { type: Boolean, default: true },
    editing: { type: String, default: null },
    startEdit: { type: Date, default: null },
}, { timestamps: true });

export const EventModel = mongoose.model<IEvent>('events', EventSchema);