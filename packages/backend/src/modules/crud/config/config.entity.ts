import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Property} from "@mikro-orm/core";

@Entity()
@ObjectType()
export class ConfigEntity extends BaseEntity {
    @Field()
    @Property()
    data: string = "{}";
}
