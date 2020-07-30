import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {StatusType} from "@truecost/shared";
import {NumberScalar, NumberType} from "../../../scalars";

@InputType()
export class BookingInput extends BaseInput {
    @Field(() => StatusType, {nullable: true})
    status?: StatusType;

    @Field({nullable: true})
    user?: string;
    @Field({nullable: true})
    game?: string;

    @Field(() => NumberScalar, {nullable: true})
    total?: NumberType;
    @Field({nullable: true})
    code?: string;
    @Field({nullable: true})
    pi?: string;
    
    @Field({nullable: true})
    info?: string;
    @Field({nullable: true})
    data?: string;
}
