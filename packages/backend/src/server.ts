import * as express from 'express';
import {DI} from "./orm";
import * as path from 'path';
import {redis} from "./redis";
import {RedisStore} from 'connect-redis';

import fastify from 'fastify';
import fastifycookie from 'fastify-cookie';
import fastifycors from "fastify-cors";
import fastifygql from "mercurius";
import fastifygqlupload from 'mercurius-upload';
import fastifysession from 'fastify-session';
import fastifystatic from 'fastify-static';
import {domain, environment} from './helpers/route';

import Stripe from 'stripe';
import {creds} from './helpers/creds';
import {createOrder} from './modules/other/webhook';
import {GraphQLSchema} from 'graphql';
import {ItemEntity} from './modules/crud/item/item.entity';
import {GameEntity} from './modules/crud/game/game.entity';
import {BlogEntity} from './modules/crud/blog/blog.entity';

export interface Context {
    req: express.Request;
    res: express.Response;
}

//TODO: fastify-rate-limit
//https://github.com/dougg0k/nodejs_graphql_typescript_starter/blob/master/src/index.ts

const init = async (schema: GraphQLSchema, store: RedisStore) => {
    const app = fastify({logger: false});

    app.register(fastifycors, {
        credentials: true,
        origin: true,
    });
    app.register(fastifystatic, {
        root: path.join(__dirname, '/../static'),
    });

    app.register(fastifygqlupload, {
        maxFileSize: 6 * 1024 * 1024,
    });
    app.register(fastifycookie);
    app.register(fastifysession, {
        store: new store({client: redis.client}),
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
        cache: true,
        schema,
        jit: 1,
        graphiql: true,
        allowBatchedQueries: true,
        context: async (req: any, res: any) => {
            DI.em.clear();
            return ({req, res});
        },
    });


    app.register((fastify, opts, next) => {
        app.addContentTypeParser('application/json', {parseAs: 'buffer'},
            (_, body, done) => {
                try {
                    done(null, {raw: body});
                } catch (error) {
                    error.statusCode = 400;
                    done(error, undefined);
                }
            },
        );

        app.post(`/webhook/payment/stripe`, {
            handler: async (request, response) => {
                try {
                    const data = creds("stripe");
                    const stripe = new Stripe(data.sk, {apiVersion: '2020-08-27'});

                    const sig = request.headers['stripe-signature'] as string;
                    const event = stripe.webhooks.constructEvent((request.body as any).raw, sig, data.webhook);

                    if (event.type === 'checkout.session.completed') {
                        const session: any = event.data.object;
                        await createOrder(session?.metadata?.id, "stripe");
                    }
                } catch (err) {
                    console.log("err", err);
                    return response.code(400).send();
                }

                return response.send({received: true});
            },
        });

        next();
    });

    app.get('/sitemap', {
        handler: async (request, response) => {
            try {
                const blogs = (await DI.em.find(BlogEntity,
                    {active: true}, {fields: ["url"]})).map(g => g.url);
                const games = (await DI.em.find(GameEntity,
                    {active: true}, {fields: ["url"]})).map(g => g.url);
                const items = (await DI.em.find(ItemEntity,
                    {active: true}, {fields: ["url", "game"]})).map(i => ({
                        g: i.game.url,
                        u: i.url,
                    }));

                return response.send({games, items, blogs});
            } catch (err) {
                console.log("err", err);
                return response.code(400).send();
            }
        },
    });


    return app;
};

export {init};
