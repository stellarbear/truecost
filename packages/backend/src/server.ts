import * as express from 'express';
import {GraphQLSchema} from "graphql";
import {ApolloServer} from "apollo-server-express";
import {DI} from "./orm";
import * as path from 'path';
import * as session from "express-session";
import {redis} from "./redis";
import {RedisStore} from 'connect-redis';
import {UserEntity} from './modules/crud/user/user.entity';

export interface Context {
    req: express.Request;
    res: express.Response;
    user?: UserEntity;
}

export const sessionCookieName = 'sid';

const init = async (schema: GraphQLSchema, store: RedisStore) => {
    const app = express();

    const apolloServer = new ApolloServer({
        schema,
        context: async ({req, res}): Promise<Context> => {
            DI.em.clear();
            const sid = (req as any).session.sid;

            if (!sid) {
                return ({req, res});
            }

            const key = `${redis.keys.session}:${sid}`;
            const userId = await redis.client.get(key + '-user');
            const sessionId = await redis.client.get(key + '-session');

            if (!userId || !sessionId) {
                return ({req, res});
            }

            const user = await DI.userRepo.findOne({id: userId});
            if (!user || user.session !== sessionId) {
                return ({req, res});
            }

            return ({req, res, user});
        },
        introspection: true,
        playground: true,
    });


    app.use(express.static(path.join(__dirname, '/../static')));
    app.use(
        session({
            store: new store({client: redis.client}),
            name: sessionCookieName,
            secret: "aslkdfjoiq12312",
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
            },
        }),
    );

    apolloServer.applyMiddleware({
        app,
        cors: {
            credentials: true,
            origin: true,
        },
        bodyParserConfig: {
            limit: '6mb',
        },
        path: `/graphql`,
    });

    return app;
};

export {init};
