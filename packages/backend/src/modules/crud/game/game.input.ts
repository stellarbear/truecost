import {Field, InputType} from "type-graphql";
import {MetaInput} from "../base/base.input";
import {UploadScalar, UploadType} from "../../../scalars";

@InputType()
export class GameInput extends MetaInput {

    @Field(() => [UploadScalar], {nullable: true})
    background: UploadType[] = [];

    @Field(() => [UploadScalar], {nullable: true})
    assistant: UploadType[] = [];

    @Field({nullable: true})
    twitter?: string;
}
