import * as Redis from "ioredis";
import * as session from "express-session";
import * as connectRedis from "connect-redis";

const client = new Redis({host: 'redis'});

const keys = {
    "session": "session",
    "confirm": "confirm",
    "forget": "forget",
};

const duration = {
    "hour": 60 * 60,
    "day": 60 * 60 * 24,
    "week": 60 * 60 * 24 * 7,
    "month": 60 * 60 * 24 * 30,
};

const redis = {client, keys, duration};

const init = () => {
    return connectRedis(session);
};

export {redis, init};

