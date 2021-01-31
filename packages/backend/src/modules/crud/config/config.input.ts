import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";

@InputType()
export class ConfigInput extends BaseInput {
    @Field({nullable: true})
    data?: string;
}
