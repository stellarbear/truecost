import {BaseInput} from "../base/base.input";
import {NumberScalar, NumberType, UploadScalar, UploadType} from "../../../scalars";
import {Field, InputType} from "type-graphql";

@InputType()
export class ItemInput extends BaseInput {
    @Field({nullable: true})
    url?: string;

    @Field({nullable: true})
    link?: string;
    @Field(() => [UploadScalar], {nullable: true})
    images: UploadType[] = [];

    @Field(() => NumberScalar, {nullable: true})
    price?: NumberType;
    @Field({nullable: true})
    range?: string;
    @Field(() => NumberScalar, {nullable: true})
    rate?: NumberType;
    @Field(() => NumberScalar, {nullable: true})
    ppl?: NumberType;
    @Field(() => NumberScalar, {nullable: true})

    buy?: NumberType;
    @Field(() => NumberScalar, {nullable: true})
    eta?: NumberType;
    @Field(() => NumberScalar, {nullable: true})
    discount?: NumberType;
    @Field(() => NumberScalar, {nullable: true})
    limit?: NumberType;

    @Field({nullable: true})
    obtain?: string;
    @Field({nullable: true})
    requirements?: string;
    @Field({nullable: true})
    topOffer?: boolean;
    @Field({nullable: true})
    direct?: boolean;


    @Field({nullable: true})
    game?: string;
    @Field(() => [String], {nullable: true})
    tag?: string[];
    @Field(() => [String], {nullable: true})
    option?: string[];
    @Field(() => [String], {nullable: true})
    item?: string[];
}
