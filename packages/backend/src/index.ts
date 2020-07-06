import "reflect-metadata";
import {init as ormInit} from './orm';
import {init as schemaInit} from './schema';
import {init as serverInit} from './server';
import {init as redisInit} from './redis';

(async () => {
    await ormInit();
    const redis = await redisInit();
    const schema = await schemaInit();
    const server = await serverInit(schema, redis);

    server.listen(7000, '0.0.0.0');
})();
