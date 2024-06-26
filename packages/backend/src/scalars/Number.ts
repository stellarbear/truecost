import {GraphQLScalarType} from "graphql";

export type NumberType = [number, number] | number;

export const NumberScalar = new GraphQLScalarType({
    name: "NumberScalar",
    description: "Number handle",
    parseValue: (value: NumberType) => value,
    serialize: (value: number) => value,
    parseLiteral: (ast) => ast,
});
