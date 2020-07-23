import {ApolloError} from "apollo-boost";

//  TODO: refactor this nightmare
export const parseApolloError = (error: ApolloError): Record<string, any> => {
    const {message, graphQLErrors, networkError} = error;
    if (!graphQLErrors) {
        return {message};
    }
    /*
        if ((networkError as any)?.result?.errors) {
            const errors = (networkError as any)?.result?.errors;
            debugger;
            if (Array.isArray(errors) && errors.length > 0) {
                debugger;
                const prepare = errors.filter(e => e?.message && e?.extensions?.exception?.field)
                .map(e =>( {message: e.message, field: e.extensions.exception.field}));
                debugger;
            }
        }
        */
    let objResult = {};

    if (message == "GraphQL error: Argument Validation Error") {
        objResult = graphQLErrors
            .flatMap(error => error.extensions && error.extensions.exception && error.extensions.exception.validationErrors
                ? error.extensions.exception.validationErrors : [])
            .reduce((obj, curr) => {
                obj[curr.property] = (obj[curr.property] || []).concat(Object.values(curr.constraints));
                return obj;
            }, {});
    } else {
        objResult = graphQLErrors
            .reduce((obj: any, curr) => {
                if (curr.extensions && curr.message && curr.extensions.exception) {
                    (curr.extensions.exception.field || []).forEach((f: string) => obj[f] = (obj[f] || []).concat(curr.message));
                }
                return obj;
            }, {});
    }

    return objResult;
};
