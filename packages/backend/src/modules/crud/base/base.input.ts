import {Field, InputType} from "type-graphql";
import {NumberScalar, NumberType} from "../../../scalars";

@InputType({isAbstract: true})
export abstract class BaseInput {
    @Field({nullable: true})
    id?: string;

    @Field({nullable: true})
    name?: string;

    @Field({nullable: true})
    active?: boolean;

    @Field(() => NumberScalar, {nullable: true})
    order?: NumberType;
}

@InputType({isAbstract: true})
export abstract class MetaInput extends BaseInput {
    @Field({nullable: true})
    url?: string;
}
