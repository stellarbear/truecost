import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";

@InputType()
export class TagInput extends BaseInput {
    @Field({nullable: true})
    game?: string;
    @Field(() => [String], {nullable: true})
    item: string[] = [];
}
