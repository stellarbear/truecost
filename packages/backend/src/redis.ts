import * as Redis from "ioredis";

const client = new Redis({host: 'redis'});

const keys = {
    "session": "session",
    "confirm": "confirm",
    "forget": "forget",
};

const duration = {
    "hour": 60 * 60,
    "day": 60 * 60 * 24,
    "month": 60 * 60 * 24 * 30,
};

const redis = {client, keys, duration};

export {redis};
