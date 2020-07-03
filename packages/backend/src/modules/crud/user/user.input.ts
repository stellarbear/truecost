import {Field, InputType} from "type-graphql";
import {BaseInput} from "../base/base.input";
import {RoleType} from "@truecost/shared";

@InputType()
export class UserInput extends BaseInput {
    @Field(() => RoleType, {nullable: true})
    role?: RoleType;

    @Field({nullable: true})
    email?: string;

    @Field({nullable: true})
    confirmed?: boolean;

    @Field(() => [String], {nullable: true})
    booking?: string[];
}
