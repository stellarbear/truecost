import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Property} from "@mikro-orm/core";

@Entity()
@ObjectType()
export class MetaEntity extends BaseEntity {
    @Field()
    @Property()
    url!: string;

    @Field()
    @Property()
    tags: string = "{}";
}
