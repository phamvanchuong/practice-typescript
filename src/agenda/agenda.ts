import { Agenda, Job } from 'agenda/es';

import { connectMongoose } from '../database';
import { EventModel } from '../models/event';

// const mongoConnectionString = 'mongodb://127.0.0.1/agenda'
const mongoConnectionString = 'mongodb+srv://trello:trello@trello-cluster.hu74b.mongodb.net/trello?retryWrites=true&w=majority'
// const mongoConnectionString = 'mongodb://localhost:2717,localhost:2727,localhost:2737/agenda?replicaSet=myReplica&retryWrites=true';
export const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('connectDB', async (job: Job) => {
    await connectMongoose();
});

agenda.define('changeEventExpired', async (job: Job) => {
    const { eventId, isExpired } = job.attrs.data;
    await EventModel.findByIdAndUpdate(eventId, { $set: { isExpired: isExpired } });
})