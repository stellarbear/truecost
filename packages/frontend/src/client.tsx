import {hydrate, render} from "react-dom";
import React, {useEffect} from "react";
import {BrowserRouter, useLocation} from "react-router-dom";
import {NormalizedCacheObject} from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import {Storage} from "auxiliary/storage";


import App from "app";

import {theme} from "theme";
import {ThemeProvider} from "@material-ui/styles";
import createApolloClient from "apollo";

declare global {
    interface Window {
        apolloState: NormalizedCacheObject;
    }
}

const client = createApolloClient({browser: true});

const storageScrollKey = ["shop", "scroll"];
const storageScrollPersistKey = ["shop", "scroll!"];

const ScrollToTop: React.FC = () => {
    const {pathname} = useLocation();

    useEffect(() => {
        window.scroll({top: 0, left: 0, behavior: "smooth"});
    }, [pathname]);

    return null;
};

const BaseApp = (): JSX.Element => {

    React.useEffect((): void => {
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            if (jssStyles.parentNode) {
                jssStyles.parentNode.removeChild(jssStyles);
            }
        }
    }, []);

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <ScrollToTop />
                    <App />
                </ThemeProvider>
            </BrowserRouter>
        </ApolloProvider>
    );
};
const renderMethod = module.hot ? render : hydrate;
renderMethod(
    <BaseApp />,
    document.getElementById("root"),
);

if (module.hot) {
    module.hot.accept();
}
