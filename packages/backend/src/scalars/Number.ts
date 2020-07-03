import {GraphQLScalarType} from "graphql";

export type RangeType = {
    from: number;
    to: number;
};
export type NumberType = RangeType | number;

export const NumberScalar = new GraphQLScalarType({
    name: "NumberScalar",
    description: "Number handle",
    parseValue: (value: NumberType) => value,
    serialize: (value: number) => value,
    parseLiteral: (ast) => ast,
});
