import {Field, InputType} from "type-graphql";
import {MetaInput} from "../base/base.input";
import {NumberScalar, NumberType, UploadScalar, UploadType} from "../../../scalars";

@InputType()
export class BlogInput extends MetaInput {
    @Field(() => NumberScalar, {nullable: true})
    date?: NumberType;

    @Field({nullable: true})
    preview?: string;

    @Field({nullable: true})
    text?: string;

    @Field(() => [UploadScalar], {nullable: true})
    images: UploadType[] = [];
}
