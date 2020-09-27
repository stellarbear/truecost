/* eslint-disable */
import express from 'express';
import app from './server';
import {frontend} from 'auxiliary/route';

const basePort = frontend.port;

if (module.hot) {
    module.hot.accept('./server', () => {
        console.log('🔁  HMR Reloading `./server`...');
    });
    console.info('✅  Server-side HMR Enabled!');
}

if (!basePort) {
    throw new Error('port was not specified')
}

export default express()
    .use((req, res) => (app as any).handle(req, res))
    .listen(basePort, () => {

        console.log(`> Started on port ${basePort}`);
    });
