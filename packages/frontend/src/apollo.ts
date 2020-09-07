import fetch from "isomorphic-fetch";
import {onError} from "@apollo/client/link/error";
import {createUploadLink} from "apollo-upload-client";
import {backend} from "auxiliary/route";
import {ApolloClient, ApolloLink, InMemoryCache} from "@apollo/client";

interface IApolloClient {
    ssr: boolean;
    cookie?: string;
}

const errorLink = onError(({graphQLErrors}) => {
    if (graphQLErrors) {
        graphQLErrors.map(({message}) => console.log(message));
    }
});

const httpLink = ({cookie}: IApolloClient) => createUploadLink({
    uri: backend.endpoint,
    credentials: "include",
    fetch,
    headers: {
        cookie,
    },
});

const link = (props: IApolloClient) => ApolloLink.from([
    errorLink,
    httpLink(props),
]);

const createApolloClient = ({ssr, cookie}: IApolloClient) => {
    const client = new ApolloClient({
        cache: !ssr ? new InMemoryCache().restore((window as any).apolloState) : new InMemoryCache(),
        ...(ssr
            ? {ssrMode: true}
            : {ssrForceFetchDelay: 100}
        ),
        defaultOptions: {
            query: {
                fetchPolicy: 'cache-first',
            },
        },
        connectToDevTools: !ssr,
        link: link({ssr, cookie}),
    });

    return client;
};

export default createApolloClient;
