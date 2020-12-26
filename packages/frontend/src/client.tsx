import {hydrate, render} from "react-dom";
import React from "react";
import {BrowserRouter} from "react-router-dom";

import "css/float.css";
import App from "app";
import {theme} from "theme";
import {ThemeProvider} from "@material-ui/styles";
import createApolloClient from "apollo";
import {ApolloProvider} from "@apollo/client";

const client = createApolloClient({
    ssr: false,
});


const BaseApp: React.FC = () => {
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement?.removeChild(jssStyles);
        }
    }, []);

    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <ThemeProvider theme={theme}>
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