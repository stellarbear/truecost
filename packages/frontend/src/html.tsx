import * as React from 'react';
import {NormalizedCacheObject} from '@apollo/client';
import {HelmetData} from 'react-helmet';
import {Dict} from '@truecost/shared';

interface IProps {
    css: string;
    assets: Dict<{js: string}>;
    helmet: HelmetData;
    content: string;
    state: NormalizedCacheObject;
}

export const Html: React.FC<IProps> = ({assets, helmet, content, state, css}) => (
    <html lang="en">
        <head>
            {helmet.title.toComponent()}
            {helmet.meta.toComponent()}
            {helmet.link.toComponent()}
            {helmet.script.toComponent()}
            <meta charSet='utf-8' />
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

            <script src={assets.client.js} defer></script>
            <script src={assets.vendor.js} defer></script>


            {font()}
            {trustpilot()}
            <style id="jss-server-side">{css}</style>
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

const font = () => (
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
);

const trustpilot = () => (
    <script type="text/javascript"
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        defer></script>
);

const gtmSeo = () => (
    <script>{(function (w: any, d: any, s: any, l: any, i: any) {
        w[l] = w[l] || []; w[l].push({
            'gtm.start':
                new Date().getTime(), event: 'gtm.js',
        }); const f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-PBRRBNK') as any}</script>
);

const gtmSeoNoJs = () => (
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PBRRBNK"
        height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe></noscript>
);