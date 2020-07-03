import copyToClipboard from "./clipboard";
import {CRUDgql, getResolverName} from "./gql";
import parseQLErrors from "./error";
import {omit, subtract, subtractNotPure} from "./object";


export {
    omit, subtract, subtractNotPure, copyToClipboard, parseQLErrors,
    getResolverName, CRUDgql,
};
