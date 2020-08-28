import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, Enum, ManyToOne, OneToMany, Property, Unique} from "mikro-orm";
import {RoleType} from "@truecost/shared";
import {BookingEntity} from "../booking/booking.entity";
import {SubscriptionEntity} from "../subscription/subscription.entity";

@Entity()
@ObjectType()
export class UserEntity extends BaseEntity /* implements IUser*/ {
    @Field()
    @Enum(() => RoleType)
    role: RoleType = RoleType.ANON;

    @Field()
    @Unique()
    @Property()
    email: string = "";
    @Property()
    password = "";
    @Property()
    salt: string = "";

    @Property()
    verified: boolean = false;

    @Field(() => [BookingEntity])
    @OneToMany(() => BookingEntity, booking => booking.user, {orphanRemoval: true})
    item = new Collection<BookingEntity>(this);


    @Field(() => SubscriptionEntity, {nullable: true})
    @ManyToOne(() => SubscriptionEntity, {nullable: true})
    subscription?: SubscriptionEntity;

    @Field({nullable: true})
    @Property({nullable: true})
    subscribeDate?: Date;
}
