import * as React from 'react';
import {NormalizedCacheObject} from 'apollo-boost';
import {useScript} from 'auxiliary/useScript';

export interface IAsset {
    js: string;
    css: string;
}

export interface IAssets {
    client: IAsset;
}

interface IProps {
    assets: IAssets,
    css: string,
    content: string,
    state: NormalizedCacheObject
}

export const Html: React.FC<IProps> = ({assets, css, content, state}) => (
    <html>
        <head>
            <meta charSet='utf-8' />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

            <style id="jss-server-side">${css}</style>
            <script src={assets.client.js} defer></script>
            {assets.client.css && <link rel="stylesheet" href={assets.client.css} />}
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                async></script>
        </head>
        <body style={{margin: 0}}>
            <div id="root" dangerouslySetInnerHTML={{__html: content}} />
            <div id="clipboard"></div>
            <script dangerouslySetInnerHTML={{
                __html: `window.apolloState=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
            }} />
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-160874000-1"></script>
        </body>
    </html>
);