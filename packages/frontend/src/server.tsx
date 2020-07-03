import React from "react";
import {StaticRouter} from "react-router-dom";
import {renderToString} from "react-dom/server";
import Helmet, {HelmetData, HelmetDatum} from "react-helmet";
import {StaticRouterContext} from "react-router";

import fs from "fs";
import path from "path";
import express from "express";

import App from "./app";


import {theme} from "theme";
import {ServerStyleSheets, ThemeProvider} from "@material-ui/styles";

import customCss from "css";
import {NormalizedCacheObject} from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import {getDataFromTree} from "@apollo/react-ssr";
import createApolloClient from "apollo";


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
//const appSrc: string = path.resolve(fs.realpathSync(process.cwd()), "src");

const helmetParse = (data: HelmetDatum) => data.toString().replace(/ data-react-helmet="true"/g, "");

const template = ({helmet, markup, assets, ssrCss, customCss, initialState}: ITemplate): string => {
    const apolloState = JSON.stringify(initialState).replace(/</g, "\\u003c").replace(/'/g, "\\'");
    return (`
<!doctype html>
<html lang="ru">
<head>
	<base href="/" />
	${helmetParse(helmet.title)}
	${helmetParse(helmet.meta)}
	${helmetParse(helmet.link)}
	<meta httpequiv="X-UA-Compatible" content="IE=edge" />
	<meta charset='utf-8' />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<link href="https://fonts.googleapis.com/css?family=Russo+One&display=swap" rel="stylesheet">

	<link rel="manifest" href="/manifest.json">
	<style id="jss-server-side">${ssrCss}</style>

	${process.env.NODE_ENV === "production"
        ? `<script src="${assets.client.js}" defer></script>`
        : `<script src="${assets.client.js}" defer crossorigin></script>`}
	${assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ""}

	<style>${customCss}</style>

	<script>
		window.apolloState = '${apolloState}';
	</script>
	<script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
	<script defer src="auxiliary/blotter.min.js"></script>
</head>
<body>
	<div class="desktop">
	</div>

	<div class="mobile">
	</div>

	<div class="content">
		<div id="root">${markup}</div>
		<div id="clipboard"></div>
	</div>

</body>
</html>
`);
};

/*
const script = document.createElement("script");
script.src = "auxiliary/blotter.min.js";
script.async = true;
script.onload = () => {
	setCaptcha(generateCaptcha());
	setCanShowCaptcha(true);
}

document.body.appendChild(script);
*/

const minifyCss = (css: string): string => {
    css = css.replace(": ", ":");

    const replaceArray = ["\r\n", "\r", "\n", "\t", "  ", "    ", "    "];
    css = css.replace(RegExp("/" + replaceArray.join("|") + "/", "g"), "");

    return css;
};

server
    .disable("x-powered-by")
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR as string))
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

        const assets: IAssets = await import(process.env.RAZZLE_ASSETS_MANIFEST as string);

        console.log('assets passed');
        getDataFromTree(app).then(() => {
            const markup: string = renderToString(
                sheets.collect(app),
            );
            const initialState = client.extract();
            console.log('--------------------------');
            //console.log(initialState);

            res.status(context.statusCode || 200)
                .send(
                    template({
                        assets,
                        markup: markup,
                        initialState,
                        customCss: minifyCss(customCss),
                        ssrCss: minifyCss(sheets.toString()),
                        helmet: Helmet.renderStatic(),
                    }),
                );
        }).catch(console.log);
    });

export default server;
