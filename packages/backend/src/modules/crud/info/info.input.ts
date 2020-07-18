import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {UploadScalar, UploadType} from "../../../scalars";

@InputType()
export class InfoInput extends BaseInput {
    @Field({nullable: true})
    text?: string;
    @Field({nullable: true})
    redirect?: string;

    @Field(() => [String], {nullable: true})
    tag?: string[];
    @Field(() => [String], {nullable: true})
    item?: string[];

    @Field(() => UploadScalar, {nullable: true})
    image?: UploadType;
}
