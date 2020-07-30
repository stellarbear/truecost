import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Enum, Property, Unique, OneToMany, Collection} from "mikro-orm";
import {RoleType, IUser} from "@truecost/shared";
import {BookingEntity} from "../booking/booking.entity";

@Entity()
@ObjectType()
export class UserEntity extends BaseEntity implements IUser {
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
    salt: string = "";

    @Property()
    verified: boolean = false;

    @Field(() => [BookingEntity])
    @OneToMany(() => BookingEntity, booking => booking.user, {orphanRemoval: true})
    item = new Collection<BookingEntity>(this);
}
