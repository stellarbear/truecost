import {Field, InputType} from "type-graphql";
import {BaseMetaInput} from "../base/base.input";
import {NumberScalar, NumberType, UploadScalar, UploadType} from "../../../scalars";

@InputType()
export class BlogInput extends BaseMetaInput {
    @Field(() => NumberScalar, {nullable: true})
    date?: NumberType;

    @Field({nullable: true})
    preview?: string;

    @Field({nullable: true})
    text?: string;

    @Field(() => [UploadScalar], {nullable: true})
    images: UploadType[] = [];
}
