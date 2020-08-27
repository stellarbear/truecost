import * as React from "react";
import {StaticRouter} from "react-router-dom";
import ReactDOMServer from "react-dom/server";
import Helmet, {HelmetData, HelmetDatum} from "react-helmet";
import {StaticRouterContext} from "react-router";
import express from "express";

import App from "./app";

import * as path from 'path';
import {theme} from "theme";
import {ServerStyleSheets, ThemeProvider} from "@material-ui/styles";

import {ApolloProvider} from "@apollo/react-hooks";
import {renderToStringWithData} from "@apollo/react-ssr";
import createApolloClient from "apollo";
import {environment} from "auxiliary/route";
import {Html, IAssets} from "html";

const server = express();

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
                        <App />
                    </ThemeProvider>
                </StaticRouter>
            </ApolloProvider>
        );

        const assets: IAssets = await import(process.env.RAZZLE_ASSETS_MANIFEST!);

        renderToStringWithData(sheets.collect(app)).then((content) => {
            const initialState = client.extract();

            const html = <Html assets={assets} css={sheets.toString().replace(/\s/g, '')} content={content} state={initialState} />;

            res.status(context.statusCode || 200)
                .send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
            res.end();

        }).catch(console.log);
    });

export default server;
