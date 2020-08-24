import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";

@InputType()
export class MetaInput extends BaseInput {
    @Field({nullable: true})
    url?: string;

    @Field({nullable: true})
    metatag?: string;
}
