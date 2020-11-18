import {BaseEntity} from "../base/base.entity";
import {Field, Int, ObjectType} from "type-graphql";
import {Entity, Property} from "@mikro-orm/core";
import {ISubscription} from "@truecost/shared";


@Entity()
@ObjectType()
export class SubscriptionEntity extends BaseEntity implements ISubscription {
    @Field(() => Int, {nullable: true})
    @Property()
    days: number = 0;

    @Field(() => Int, {nullable: true})
    @Property()
    discount: number = 0;

    @Field(() => Int, {nullable: true})
    @Property()
    price: number = 0;

    @Field({nullable: true})
    @Property()
    description: string = "";
}
