import {InputType, Field} from "type-graphql";

@InputType()
export class BookingOrderLinkInput {
    @Field({nullable: true})
    subscription?: string;

    @Field()
    data!: string;

    @Field()
    info!: string;
    @Field()
    game!: string;
    @Field()
    email!: string;
    @Field()
    currency!: string;
}