import {Field, InputType} from "type-graphql";
import {BaseMetaInput} from "../base/base.input";
import {UploadScalar, UploadType} from "../../../scalars";

@InputType()
export class GameInput extends BaseMetaInput {

    @Field(() => [UploadScalar], {nullable: true})
    background: UploadType[] = [];

    @Field(() => [UploadScalar], {nullable: true})
    assistant: UploadType[] = [];

    @Field({nullable: true})
    twitter?: string;
}
