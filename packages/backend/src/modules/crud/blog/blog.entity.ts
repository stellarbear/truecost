import {BaseEntity} from "../base/base.entity";
import {Field, Float, ObjectType} from "type-graphql";
import {Entity, ManyToOne, Property, Unique} from "@mikro-orm/core";
import {IBlog} from "@truecost/shared";
import {GameEntity} from "../game/game.entity";


@Entity()
@ObjectType()
export class BlogEntity extends BaseEntity implements IBlog {
    @Field()
    @Unique()
    @Property()
    url!: string;

    @Field(() => Float)
    @Property()
    date: number = new Date().getTime();

    @Field()
    @Property()
    preview: string = "";

    @Field()
    @Property()
    text: string = "";

    @Field(() => [String])
    @Property()
    images: string[] = [];

    @Field(() => GameEntity, {nullable: true})
    @ManyToOne(() => GameEntity)
    game?: GameEntity;
}
