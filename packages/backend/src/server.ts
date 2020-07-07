import * as express from 'express';
import {GraphQLSchema} from "graphql";
import {DI} from "./orm";
import * as path from 'path';
import * as cors from "fastify-cors";
import {redis} from "./redis";
import {RedisStore} from 'connect-redis';
import {UserEntity} from './modules/crud/user/user.entity';
import {graphqlUploadExpress} from 'graphql-upload';


import * as fastifygqlupload from 'fastify-gql-upload';
import * as fastifileupload from 'fastify-file-upload';
import * as fastifymultipart from 'fastify-multipart';
import * as fastify from 'fastify';
import * as fastifystatic from 'fastify-static';
import * as fastifysession from 'fastify-session';
import * as fastifycookie from 'fastify-cookie';
import * as gql from "fastify-gql";

export interface Context {
    req: express.Request;
    res: express.Response;
    user?: UserEntity;
}

//TODO: fastify-rate-limit
//https://github.com/dougg0k/nodejs_graphql_typescript_starter/blob/master/src/index.ts

export const sessionCookieName = 'sid';

const init = async (schema: GraphQLSchema, store: RedisStore) => {
    const app = fastify({logger: false});

    app.register(cors, {
        credentials: true,
        origin: true,
    });
    app.register(fastifystatic, {
        root: path.join(__dirname, '/../static')
    })

    app.register(fastifygqlupload, {
        limits: {fileSize: 6 * 1024 * 1024},
    })
    app.register(fastifycookie);
    app.register(fastifysession, {
        store: new store({client: redis.client}),
        cookieName: sessionCookieName,
        secret: "aslkdfjoiq12312aslkdfjoiq12312aslkdfjoiq12312aslkdfjoiq12312",
        //resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
    });

    app.register(gql, {
        schema,
        jit: 1,
        graphiql: true,
        allowBatchedQueries: true,
        //queryDepth: 10,
        /*errorHandler: (error: fastify.FastifyError, req: any, reply: any) => {
            console.log(error.message, error.name);
            console.log(error.statusCode, error.stack);
            //console.log(req)
            return error;
        },*/
        context: async (req: any, res: any) => {
            //TODO: 
            /*
            session: HSET : { user: id, validate: id }
            user: SET: {session[]}
            */

            console.log('context');
            DI.em.clear();
            const sid = req.session.sid;
            console.log('sid');

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
        }
    })

    return app;
};

export {init};
