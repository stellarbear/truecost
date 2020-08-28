import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {NumberScalar, NumberType} from "../../../scalars";

@InputType()
export class SubscriptionInput extends BaseInput {
    @Field(() => NumberScalar, {nullable: true})
    days?: NumberType;

    @Field(() => NumberScalar, {nullable: true})
    price?: NumberType;

    @Field(() => NumberScalar, {nullable: true})
    discount?: NumberType;

    @Field({nullable: true})
    description?: string;
}
