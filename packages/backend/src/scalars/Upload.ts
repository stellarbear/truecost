import {FileUpload} from "graphql-upload";
import {GraphQLScalarType} from "graphql";

export type UploadType = FileUpload | string;

export const UploadScalar = new GraphQLScalarType({
    name: "UploadScalar",
    description: "Upload handle or local file name",
    parseValue: (value: UploadType) => value,
    serialize: (value: string) => value,
    parseLiteral: (ast) => ast,
});
