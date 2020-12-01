import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Enum, ManyToOne, Property} from "@mikro-orm/core";
import {UserEntity} from "../user/user.entity";
import {IBooking, StatusType} from "@truecost/shared";

@Entity()
@ObjectType()
export class BookingEntity extends BaseEntity implements IBooking {
    @Field()
    @Enum(() => StatusType)
    status: StatusType = StatusType.AWAITING_FOR_CONTACT;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity)
    user!: UserEntity;

    @Field()
    @Property()
    total: number = 0;
    @Field()
    @Property()
    pi!: string;
    @Field()
    @Property()
    code!: string;

    @Field({defaultValue: "usd"})
    @Property({default: "usd"})
    currency: string = "usd";


    @Field({defaultValue: "{}"})
    @Property()
    info: string = "{}";
    @Field({defaultValue: "{}"})
    @Property()
    data: string = "{}";


    @Field(() => [String], {defaultValue: []})
    @Property()
    images: string[] = [];
}
