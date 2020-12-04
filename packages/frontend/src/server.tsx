import * as React from "react";
import {StaticRouter} from "react-router-dom";
import {renderToString, renderToStaticMarkup} from "react-dom/server";
import {getDataFromTree} from "@apollo/client/react/ssr";
import {StaticRouterContext} from "react-router";
import express from "express";

import App from "./app";

import * as path from 'path';
import {theme} from "theme";
import {ThemeProvider} from "@material-ui/styles";

import createApolloClient from "apollo";
import {environment, backend} from "auxiliary/route";
import {Html} from "html";
import {ApolloProvider} from "@apollo/client";
import {Helmet} from "react-helmet";
import {generateSiteMap} from "auxiliary/sitemap";
import {ServerStyleSheets} from "@material-ui/core";

const server = express();
const root = environment == "development"
    ? process.env.RAZZLE_PUBLIC_DIR || ""
    : path.join(__dirname, '../build/public');

server
    .disable("x-powered-by")
    .use(
        express.static(root),
    )
    .get("/sitemap.xml", async (req: express.Request, res: express.Response): Promise<void> => {
        const result = await fetch(`${backend.uri}/sitemap`);
        const {games, items, blogs} = await result.json();

        res.setHeader('Content-Type', 'text/xml');
        res.write(generateSiteMap(games, blogs, items));
        res.end();
    })
    .get("/*", async (req: express.Request, res: express.Response): Promise<void> => {
        const context: StaticRouterContext = {statusCode: 200, url: req.url};

        const sheets = new ServerStyleSheets();
        const client = createApolloClient({
            ssr: true,
            cookie: req.header('Cookie'),
        });

        const app = (
            <ApolloProvider client={client}>
                <StaticRouter context={context} location={req.url}>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </StaticRouter>
            </ApolloProvider>
        );
        getDataFromTree(sheets.collect(app)).then(() => {
            const content = renderToString(app);
            const initialState = client.extract();
            const helmet = Helmet.renderStatic();

            const html = <Html
                css={sheets.toString()}
                helmet={helmet}
                content={content}
                state={initialState} />;

            res.status(context.statusCode || 200);
            res.send(`<!doctype html>\n${renderToStaticMarkup(html)}`);
            res.end();
        }).catch(console.log);
    });

export default server;
