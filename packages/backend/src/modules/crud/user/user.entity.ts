import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, Enum, OneToMany, Property, Unique} from "mikro-orm";
import {BookingEntity} from "../booking/booking.entity";
import {v4} from "uuid";
import {RoleType} from "@truecost/shared";

@Entity()
@ObjectType()
export class UserEntity extends BaseEntity {
    @Field()
    @Enum(() => RoleType)
    role: RoleType = RoleType.ANON;

    @Field()
    @Unique()
    @Property()
    email: string = "";
    @Property()
    password: string = "";
    @Property()
    session: string = v4();
    @Property()
    salt: string = "";

    @Property()
    confirmed: boolean = false;

    @Field(() => [BookingEntity], {nullable: true})
    @OneToMany(() => BookingEntity, booking => booking.user)
    booking: Collection<BookingEntity> = new Collection<BookingEntity>(this);
}
