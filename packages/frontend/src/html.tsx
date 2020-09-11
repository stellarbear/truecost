import * as React from 'react';
import {NormalizedCacheObject} from '@apollo/client';
import {HelmetData} from 'react-helmet';

export interface IAsset {
    js: string;
    css: string;
}

export interface IAssets {
    client: IAsset;
}

interface IProps {
    assets: IAssets;
    css: string;
    helmet: HelmetData;
    content: string;
    state: NormalizedCacheObject;
}

export const Html: React.FC<IProps> = ({assets, css, helmet, content, state}) => (
    <html>
        <head>
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            <meta charSet='utf-8' />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

            <style id="jss-server-side">${css}</style>
            <script src={assets.client.js} async></script>
            {assets.client.css && <link rel="stylesheet" href={assets.client.css} />}

            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <script type="text/javascript"
                src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                defer></script>
        </head>
        <body style={{margin: 0}}>
            <div id="root" dangerouslySetInnerHTML={{__html: content}} />
            <script dangerouslySetInnerHTML={{
                __html: `window.apolloState=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
            }} />
            <script defer src="https://www.googletagmanager.com/gtag/js?id=UA-160874000-1"></script>
        </body>
    </html >
);
