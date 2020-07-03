import {UserInputError} from "apollo-server-express";

export class ApolloError extends UserInputError {
    constructor(code: string, fields: string[] = []) {
        super(code);

        this.extensions.exception = {};
        this.extensions.exception.field = fields;
    }
}
