import {InputType, Field} from "type-graphql";

@InputType()
export class BookingUpsertInput {
    @Field({nullable: true})
    id?: string;
    @Field({nullable: true})
    subscription?: string;

    @Field()
    total!: number;

    @Field()
    data!: string;
    @Field()
    pi!: string;

    @Field()
    info!: string;
    @Field()
    game!: string;
    @Field()
    email!: string;
    @Field()
    currency!: string;
}