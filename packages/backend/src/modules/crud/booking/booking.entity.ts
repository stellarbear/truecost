import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Enum, ManyToOne} from "mikro-orm";
import {UserEntity} from "../user/user.entity";
import {StatusType} from "@truecost/shared";

@Entity()
@ObjectType()
export class BookingEntity extends BaseEntity {
    @Field()
    @Enum(() => StatusType)
    status: StatusType = StatusType.AWAITING_FOR_CONTACT;

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity)
    user!: UserEntity;
}
