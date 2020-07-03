import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {StatusType} from "@truecost/shared";

@InputType()
export class BookingInput extends BaseInput {
    @Field(() => StatusType, {nullable: true})
    status?: StatusType;

    @Field({nullable: true})
    user?: string;
}
