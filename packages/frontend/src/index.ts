/* eslint-disable */
import express from 'express';
import app from './server';
import {basePort} from 'auxiliary/route';


if (module.hot) {
    module.hot.accept('./server', (): void => {
        console.log('🔁  HMR Reloading `./server`...');
    });
    console.info('✅  Server-side HMR Enabled!');
}

if (!basePort) {
    throw new Error('port was not specified')
}

export default express()
    .use((req, res): void => (app as any).handle(req, res))
    .listen(basePort, (): void => {

        console.log(`> Started on port ${basePort}`);
    });
