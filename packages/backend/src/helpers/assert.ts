import {isFunction} from "./is";
import {ApolloError} from "./error";

export type AssertionMessage = string | (() => string);

export function assert(expr: unknown, message: AssertionMessage, fields: any[] = []): asserts expr {
    if (!expr) {
        throw new ApolloError(isFunction(message) ? message() : message, fields);
    }
}