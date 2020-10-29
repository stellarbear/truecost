import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";

@InputType()
export class TagInput extends BaseInput {
    @Field({nullable: true})
    color?: string;

    @Field({nullable: true})
    game?: string;

    @Field(() => [String], {nullable: true})
    item?: string[];

    @Field(() => [String], {nullable: true})
    children?: string[];
}
