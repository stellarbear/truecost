import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {NumberScalar, NumberType} from "../../../scalars";
import {OptionArea, OptionMerge, OptionType} from "@truecost/shared";

@InputType()
export class OptionInput extends BaseInput {
    @Field(() => NumberScalar, {nullable: true})
    price?: NumberType;
    @Field(() => NumberScalar, {nullable: true})
    free?: NumberType;

    @Field(() => OptionType, {nullable: true})
    type?: OptionType;
    @Field(() => OptionArea, {nullable: true})
    area?: OptionArea;
    @Field(() => OptionMerge, {nullable: true})
    merge?: OptionMerge;

    @Field({nullable: true})
    game?: string;

    @Field(() => [String], {nullable: true})
    item?: string[];
}
