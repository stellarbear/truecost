import * as express from 'express';
import {GraphQLSchema} from "graphql";
import {DI} from "./orm";
import * as path from 'path';
import {redis} from "./redis";
import {RedisStore} from 'connect-redis';

import * as fastify from 'fastify';
import * as fastifycookie from 'fastify-cookie';
import * as fastifycors from "fastify-cors";
import * as fastifygql from "fastify-gql";
import * as fastifygqlupload from 'fastify-gql-upload';
import * as fastifysession from 'fastify-session';
import * as fastifystatic from 'fastify-static';
import {environment, domain} from './helpers/route';

import Stripe from 'stripe';
import {creds} from './helpers/creds';
import {Session} from 'inspector';

export interface Context {
    req: express.Request;
    res: express.Response;
}

//TODO: fastify-rate-limit
//https://github.com/dougg0k/nodejs_graphql_typescript_starter/blob/master/src/index.ts

export const sessionCookieName = 'sid';

const init = async (schema: GraphQLSchema, store: RedisStore) => {
    const app = fastify({logger: false});

    app.register(fastifycors, {
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
        saveUninitialized: false,
        cookie: {
            domain: environment === "production" ? `.${domain}` : undefined,
            httpOnly: true,
            secure: "auto",
            maxAge: 1000 * 60 * 60 * 24 * 7 * 365,
        },
    });

    app.register(fastifygql, {
        schema,
        jit: 1,
        graphiql: true,
        allowBatchedQueries: true,
        context: async (req: any, res: any) => {
            DI.em.clear();
            
            const {sid} = req.session;
            console.log('sid', sid);
            return ({req, res});
        }
    })

    

    app.post(`/webhook/payment/stripe`, (request, response) => {

        try {
            const data = creds("stripe");
            const stripe = new Stripe(data.sk, { apiVersion: '2020-03-02' });

            const sig = request.headers['stripe-signature'] as string;
            console.log(sig);
            const event = stripe.webhooks.constructEvent(request.body, sig, (data.webhook));
            console.log(event);

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                console.log(session);
                //parseOrder(session)
            }
        } catch (err) {

        }
    });

    return app;
};

export {init};
