import {ApolloError} from "@apollo/client";

type StringType = string
type RecordType = Record<string, string>
type ArrayType = {message: string, fields: string[]}[]

const extract = (error: ApolloError): ArrayType => {
    const {graphQLErrors, networkError} = error;

    const errors = (networkError as any)?.result?.errors
        ? (networkError as any)?.result?.errors
        : graphQLErrors
            ? graphQLErrors
            : null;

    const prepare = errors.filter((e: any) => e?.message && e?.extensions?.exception?.field);
    const mapped = prepare.map((e: any) => {
        const fields = e.extensions.exception.field;
        return ({message: e.message, fields: Array.isArray(fields) ? fields : [fields]})
    });

    return mapped;

}

const covertToRecord = (errors: any[]): RecordType => {
    const result: Record<string, any> = {};

    for (let error of errors) {
        for (let field of error.fields) {
            result[field] = field in result
                ? result[field] + ", " + error.message
                : error.message;
        }
    }

    return result;
}

const covertToString = (errors: any[]): StringType => {
    const result = errors.map(({message, fields}) => fields.length > 0
        ? fields.join(", ") + " " + message
        : message).join("\n");

    return result;
}

///export function parseApolloError(error: undefined): null
//export function parseApolloError(error: ApolloError): any;
export function parseApolloError(error: ApolloError): {
    asArray: () => ArrayType,
    asString: () => StringType,
    asRecord: () => RecordType
} {
    const extracted = extract(error);

    return ({
        asArray: () => extracted,
        asString: () => covertToString(extracted),
        asRecord: () => covertToRecord(extracted),
    });
};
