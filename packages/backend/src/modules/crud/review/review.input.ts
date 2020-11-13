import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";

@InputType()
export class ReviewInput extends BaseInput {
    @Field({nullable: true})
    who?: string;
    @Field({nullable: true})
    text?: string;
    @Field({nullable: true})
    title?: string;
}
