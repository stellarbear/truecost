import {BaseMetaEntity, BaseEntity} from "../base/base.entity";
import {Field, Float, ObjectType, Int} from "type-graphql";
import {Entity, Property} from "mikro-orm";
import {ISubscription} from "@truecost/shared"


@Entity()
@ObjectType()
export class SubscriptionEntity extends BaseEntity implements ISubscription {
    @Field(() => Int)
    @Property()
    days: number = 0;

    @Field(() => Int)
    @Property()
    discount: number = 0;

    @Field(() => Int)
    @Property()
    price: number = 0;

    @Field()
    @Property()
    description: string = "";
}
