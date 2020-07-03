import {MetaEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Property} from "mikro-orm";

@Entity()
@ObjectType()
export class GameEntity extends MetaEntity {

    @Field(() => [String])
    @Property()
    background: string[] = [];

    @Field(() => [String])
    @Property()
    assistant: string[] = [];

    @Field()
    @Property()
    twitter: string = "";
}
