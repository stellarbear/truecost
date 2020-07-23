import {ApolloClient, ApolloLink, InMemoryCache} from "apollo-boost";
import fetch from "isomorphic-fetch";
import {onError} from "apollo-link-error";
import {createUploadLink} from "apollo-upload-client";
import {serverEndpoint} from "auxiliary/route";

interface IApolloClient {
    browser: boolean;
}

const errorLink = onError(({graphQLErrors}) => {
    if (graphQLErrors) {
        graphQLErrors.map(({message}) => console.log(message));
    }
});

const httpLink = (cookie?: string) => createUploadLink({
    uri: serverEndpoint,
    credentials: "include",
    fetch,
    headers: {
        cookie,
    },
});

const link = (cookie?: string) => ApolloLink.from([
    errorLink,
    httpLink(cookie),
]);
/*
const enchancedFetch = (url, init) => {
	return fetch(url, {
		...init,
		headers: {
			...init.headers,
			"Cookie": cookie
		}
	}).then(response => response)
}*/

const createApolloClient = ({browser}: IApolloClient, cookie?: string) => {
    if (browser) {
        console.log('state', window.apolloState);
    }

    const client = new ApolloClient({
        cache: browser ? new InMemoryCache().restore(window.apolloState) : new InMemoryCache(),
        ssrForceFetchDelay: browser ? 100 : undefined,
        defaultOptions: {
          query: {
            fetchPolicy: 'cache-first',
          },
        },
        connectToDevTools: browser,
        ssrMode: true,
        link: link(cookie),
    });

    return client;
};

export default createApolloClient;
