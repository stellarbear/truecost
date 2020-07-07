import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";

@InputType()
export class CategoryInput extends BaseInput {
    @Field({nullable: true})
    game?: string;

    @Field({nullable: true})
    parent?: string;
    @Field(() => [String], {nullable: true})
    children?: string[];
}
