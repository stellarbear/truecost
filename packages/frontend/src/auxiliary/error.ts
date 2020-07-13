import {ApolloError} from "apollo-boost";

const parseQlErrors = (error: ApolloError) => {
    const {message, graphQLErrors} = error;
    let objResult = {};
    if (message) {
        return message;
    }

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

export default parseQlErrors;
