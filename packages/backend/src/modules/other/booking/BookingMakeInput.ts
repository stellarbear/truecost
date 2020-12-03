import {InputType, Field} from "type-graphql";

@InputType()
export class BookingMakeInput {
    @Field({nullable: true})
    coupon?: string;
    @Field({nullable: true})
    subscription?: string;

    @Field()
    currency!: string;
    @Field()
    info!: string;
    @Field()
    booking!: string;
    @Field()
    email!: string;
    @Field()
    game!: string;
    @Field()
    method!: string;
}