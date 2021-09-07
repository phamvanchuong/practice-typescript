import { connect } from 'mongoose';

import { agenda } from './agenda/agenda';

// (async () => {
//     await agenda.start();
//     await agenda.every('1 minutes', 'connectDB');

// })();

// connect mongoose
export async function connectMongoose(): Promise<void> {
    connect('mongodb+srv://trello:trello@trello-cluster.hu74b.mongodb.net/trello?retryWrites=true&w=majority', {
        // connect('mongodb://localhost:2717,localhost:2727,localhost:2737?replicaSet=myReplica&retryWrites=true', {
        // connect('mongodb://127.0.0.1/test',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }, async (err: Error) => {
        if (err) {
            console.log(err.message);
        }
        else {
            console.log('Connected to MongoDb!');
            await agenda.every('10 minutes', 'connectDB');
        }
    });
}