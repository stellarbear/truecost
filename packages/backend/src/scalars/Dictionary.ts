import {GraphQLScalarType} from "graphql";

export type DictionaryType = {
    key: string;
    value: any;
}[];

export const DictionaryScalar = new GraphQLScalarType({
    name: "DictionaryScalar",
    description: "Dictionary handle",
    parseValue: (value: DictionaryType) => JSON.stringify(value),
    serialize: (value: string) => JSON.parse(value),
    parseLiteral: (ast) => ast,
});
