import * as React from 'react';
import {NormalizedCacheObject} from '@apollo/client';
import {HelmetData} from 'react-helmet';
import {Dict} from '@truecost/shared';

interface IProps {
    assets: Dict<{js: string}>;
    helmet: HelmetData;
    content: string;
    state: NormalizedCacheObject;
}

export const Html: React.FC<IProps> = ({assets, helmet, content, state}) => (
    <html>
        <head>
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            <meta charSet='utf-8' />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />

            <script src={assets.client.js} defer></script>
            <script src={assets.mui.js} defer></script>
            <script src={assets.vendor.js} defer></script>

            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <script type="text/javascript"
                src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                defer></script>
            <script defer src="https://www.googletagmanager.com/gtag/js?id=UA-160874000-1"></script>
        </head>
        <body style={{margin: 0}}>
            <div id="root" dangerouslySetInnerHTML={{__html: content}} />
            <script dangerouslySetInnerHTML={{
                __html: `window.apolloState=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
            }} />
        </body>
    </html >
);
