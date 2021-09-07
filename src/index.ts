import * as dotenv from 'dotenv';
dotenv.config();

import * as hapi from '@hapi/hapi';
import * as hapiswagger from 'hapi-swagger';
import * as inert from '@hapi/inert';
import * as vision from '@hapi/vision';
import * as jwt from 'jsonwebtoken';
import * as Boom from '@hapi/boom';

import { connectMongoose } from './database';
import { routes } from './routes/index';
import { UserModel } from './models/user';
import { agenda } from './agenda/agenda';

const server: hapi.Server = new hapi.Server({
    host: 'localhost',
    port: 3000,
});

server.auth.scheme('authentication', function (server: hapi.Server, options) {
    return {
        authenticate: async function (req: hapi.Request, h: hapi.ResponseToolkit) {
            const authorization: String = req.headers.authorization;
            if (!authorization) {
                throw Boom.unauthorized('No authorization headers!');
            }
            const token: String = authorization.split(' ')[1];
            if (!token) {
                throw Boom.unauthorized('No token!');
            }
            try {
                const decoded: { userId: String, iat: Number, exp: Number } = jwt.verify(token, process.env.SECRET_KEY);
                const user = await UserModel.findById(decoded.userId);
                if (!user) throw Boom.unauthorized('No user in database!');
                return h.authenticated({ credentials: { user } });
            } catch (error) {
                throw Boom.unauthorized('Token invalid!');
            }
        }
    }
});
server.auth.strategy('auth', 'authentication');

// Adding routing
routes(server);

// Start up service
async function start(): Promise<void> {
    try {
        await agenda.start();
        agenda.on('start', job => {
            console.log(`Job ${job.attrs.name} starting`)
        })
        agenda.on('complete', job => {
            console.log(`Job ${job.attrs.name} finished`)
        })
        agenda.on('fail', (err, job) => {
            console.log(`Job ${job.attrs.name} failed with error ${err.message}`)
        })
        connectMongoose();

        //config swagger
        const swaggerOptions: hapiswagger.RegisterOptions = {
            info: {
                title: 'Test API Documentation',
                version: '1.0.0',
            },
            grouping: 'tags',
        };
        const plugins: Array<hapi.ServerRegisterPluginObject<any>> = [
            {
                plugin: inert
            },
            {
                plugin: vision
            },
            {
                plugin: hapiswagger,
                options: swaggerOptions
            },
        ];
        await server.register(plugins);

        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
}


async function graceful() {
    await agenda.stop();
    process.exit(0);
}

process.on("SIGTERM", graceful);
process.on("SIGINT", graceful);

start();