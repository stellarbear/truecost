import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Property} from "mikro-orm";

@Entity()
@ObjectType()
export class ReviewEntity extends BaseEntity {
    @Field()
    @Property()
    who: string = "";
    @Field()
    @Property()
    text: string = "";
    @Field()
    @Property()
    title: string = "";
}
