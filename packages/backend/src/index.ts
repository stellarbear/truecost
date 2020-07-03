import "reflect-metadata";
import * as path from 'path';
import * as express from 'express';
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import {EntityManager, EntityRepository, MikroORM} from 'mikro-orm';

import {BlogEntity} from './modules/crud/blog/blog.entity';
import {BaseEntity, MetaEntity} from './modules/crud/base/base.entity';
import {BlogCRUDResolver} from './modules/crud/blog/blog.resolver';
import {buildSchema, registerEnumType} from 'type-graphql';
import {ApolloServer} from 'apollo-server-express';
import {TagEntity} from "./modules/crud/tag/tag.entity";
import {ItemEntity} from "./modules/crud/item/item.entity";
import {TagCRUDResolver} from "./modules/crud/tag/tag.resolver";
import {GameEntity} from "./modules/crud/game/game.entity";
import {GameCRUDResolver} from "./modules/crud/game/game.resolver";
import {ItemCRUDResolver} from "./modules/crud/item/item.resolver";
import {OptionCRUDResolver} from "./modules/crud/option/option.resolver";
import {CategoryCRUDResolver} from "./modules/crud/category/category.resolver";
import {CategoryEntity} from "./modules/crud/category/category.entity";
import {InfoEntity} from "./modules/crud/info/info.entity";
import {InfoCRUDResolver} from "./modules/crud/info/info.resolver";
import {UserEntity} from "./modules/crud/user/user.entity";
import {BookingEntity} from "./modules/crud/booking/booking.entity";
import {UserCRUDResolver} from "./modules/crud/user/user.resolver";
import {BookingCRUDResolver} from "./modules/crud/booking/booking.resolver";
import {redis} from "./redis";
import {AccountResolver} from "./modules/other/user/account";
import {SessionResolver} from "./modules/other/user/session";
import {GameResolver} from "./modules/other/game/game";
import {OptionEntity} from "./modules/crud/option/option.entity";
import {OptionArea, OptionFilter, OptionType, RoleType, StatusType} from "@truecost/shared";


export const DI = {} as {
    orm: MikroORM;
    em: EntityManager;
    userRepo: EntityRepository<UserEntity>;
};

const app = express();

export interface Context {
    req: express.Request;
    res: express.Response;
    user?: UserEntity;
}

export const sessionCookieName = 'sid';

(async () => {
    DI.orm = await MikroORM.init({
        discovery: {
            requireEntitiesArray: true,
        },
        entities: [BaseEntity, MetaEntity,
            UserEntity, BookingEntity,
            ItemEntity, BlogEntity, GameEntity, TagEntity, OptionEntity, CategoryEntity, InfoEntity],
        dbName: 'truecost',
        type: 'mongo',
        clientUrl: 'mongodb://mongo:27017',
        logger: console.log.bind(console),
        debug: true,
        cache: {enabled: false},
    });
    DI.em = DI.orm.em;
    DI.userRepo = await DI.em.getRepository(UserEntity);

    registerEnumType(RoleType, {name: "RoleType"});
    registerEnumType(StatusType, {name: "StatusType"});
    registerEnumType(OptionType, {name: "OptionType"});
    registerEnumType(OptionArea, {name: "OptionArea"});
    registerEnumType(OptionFilter, {name: "OptionFilter"});

    const schema = await buildSchema({
        resolvers: [BlogCRUDResolver,
            GameResolver,
            UserCRUDResolver, BookingCRUDResolver,
            AccountResolver, SessionResolver,
            TagCRUDResolver, GameCRUDResolver, ItemCRUDResolver,
            OptionCRUDResolver, CategoryCRUDResolver, InfoCRUDResolver],
        dateScalarMode: "timestamp",
    });

    const apolloServer = new ApolloServer({
        schema,
        context: async ({req, res}): Promise<Context> => {
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

    const RedisStore = connectRedis(session);

    app.use(express.static(path.join(__dirname, '/../static')));
    app.use(
        session({
            store: new RedisStore({client: redis.client}),
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
    app.listen(7000, () => console.log(`> Server is running on 7000`));
})();
