import {GraphQLScalarType} from "graphql";

export type RangeType = {
    price: number;
    value: number;
    mark?: string;
};

export const RangeScalar = new GraphQLScalarType({
    name: "RangeScalar",
    description: "Range handle",
    parseValue: (value: RangeType) => JSON.stringify(value),
    serialize: (value: string) => JSON.parse(value),
    parseLiteral: (ast) => ast,
});
