import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne, Property} from "mikro-orm";

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
