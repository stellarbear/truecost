import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {UploadScalar, UploadType} from "../../../scalars";

@InputType()
export class GameInput extends BaseInput {
    @Field({nullable: true})
    url?: string;

    @Field(() => [UploadScalar], {nullable: true})
    preview: UploadType[] = [];

    @Field(() => [UploadScalar], {nullable: true})
    background: UploadType[] = [];

    @Field(() => [UploadScalar], {nullable: true})
    assistant: UploadType[] = [];

    @Field({nullable: true})
    twitter?: string;

    @Field({nullable: true})
    seo?: string;
}
