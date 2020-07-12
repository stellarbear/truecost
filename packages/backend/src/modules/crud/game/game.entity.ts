import {BaseMetaEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Property} from "mikro-orm";
import {IGame} from "@truecost/shared";

@Entity()
@ObjectType()
export class GameEntity extends BaseMetaEntity implements IGame {

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
