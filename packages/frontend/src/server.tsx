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
import {environment} from "auxiliary/route";
import {Html} from "html";
import {ApolloProvider} from "@apollo/client";
import {Helmet} from "react-helmet";

const server = express();

server
    .disable("x-powered-by")
    .use(
        express.static(
            environment == "development"
                ? process.env.RAZZLE_PUBLIC_DIR || ""
                : path.join(__dirname, '../build/public'),
        ),
    )
    .get("/*", async (req: express.Request, res: express.Response): Promise<void> => {
        const context: StaticRouterContext = {statusCode: 200, url: req.url};

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

        const assets = await import(process.env.RAZZLE_ASSETS_MANIFEST || "");
        getDataFromTree(app).then(() => {
            // We are ready to render for real
            const content = renderToString(app);
            const initialState = client.extract();
            const helmet = Helmet.renderStatic();

            const html = <Html
                helmet={helmet}
                assets={assets}
                content={content}
                state={initialState} />;

            res.status(context.statusCode || 200);
            res.send(`<!doctype html>\n${renderToStaticMarkup(html)}`);
            res.end();
        }).catch(console.log);
    });

export default server;
