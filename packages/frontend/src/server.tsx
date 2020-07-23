import * as React from "react";
import {StaticRouter} from "react-router-dom";
import ReactDOMServer, {renderToString} from "react-dom/server";
import Helmet, {HelmetData, HelmetDatum} from "react-helmet";
import {StaticRouterContext} from "react-router";
import express from "express";

import App from "./app";

import * as path from 'path';
import {theme} from "theme";
import {ServerStyleSheets, ThemeProvider} from "@material-ui/styles";

import customCss from "css";
import {NormalizedCacheObject} from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import {getDataFromTree, renderToStringWithData} from "@apollo/react-ssr";
import createApolloClient from "apollo";
import {environment} from "auxiliary/route";


interface IAsset {
    js: string;
    css: string;
}

interface IAssets {
    client: IAsset;
}

interface ITemplate {
    ssrCss: string;
    customCss: string;
    markup: string;
    assets: IAssets;
    helmet: HelmetData;
    initialState: NormalizedCacheObject;
}

const server = express();

function Html({assets, css, content, state}: { assets: IAssets, css: string, content: string, state: NormalizedCacheObject }) {
    return (
        <html>
        <head>
            <meta charSet='utf-8'/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>

            <style id="jss-server-side">${css}</style>
            <script src={assets.client.js} defer></script>
            {assets.client.css && <link rel="stylesheet" href={assets.client.css}/>}
            <link href="https://fonts.googleapis.com/css?family=Russo+One&display=swap" rel="stylesheet"/>
            <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
                    async></script>
            {//<script defer src="auxiliary/blotter.min.js"></script>
            }
        </head>
        <body style={{margin: 0}}>
        <div id="root" dangerouslySetInnerHTML={{__html: content}}/>
        <div id="clipboard"></div>
        <script dangerouslySetInnerHTML={{
            __html: `window.apolloState=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
        }}/>
        </body>
        </html>
    );
}

server
    .disable("x-powered-by")
    .use(express.static(environment == "development" ? process.env.RAZZLE_PUBLIC_DIR! : path.join(__dirname, '../build/public')))
    .get("/*", async (req: express.Request, res: express.Response): Promise<void> => {
        const context: StaticRouterContext = {statusCode: 200, url: req.url};
        const sheets: ServerStyleSheets = new ServerStyleSheets();

        const client = createApolloClient({browser: false}, req.header('Cookie'));

        const app = (
            <ApolloProvider client={client}>
                <StaticRouter context={context} location={req.url}>
                    <ThemeProvider theme={theme}>
                        <App/>
                    </ThemeProvider>
                </StaticRouter>
            </ApolloProvider>
        );

        console.log('cookies', req.header('Cookie'));
        const assets: IAssets = await import(process.env.RAZZLE_ASSETS_MANIFEST!);

        renderToStringWithData(sheets.collect(app)).then((content) => {
            const initialState = client.extract();
            const html = <Html assets={assets} css={sheets.toString()} content={content} state={initialState}/>;

            res.status(context.statusCode || 200)
                .send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`
                );
            res.end();

        }).catch(console.log);
    });

export default server;
