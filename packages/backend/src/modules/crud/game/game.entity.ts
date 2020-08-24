import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Entity, Property, OneToMany, Collection, Unique} from "mikro-orm";
import {IGame} from "@truecost/shared";
import {ItemEntity} from "../item/item.entity";
import {OptionEntity} from "../option/option.entity";
import {TagEntity} from "../tag/tag.entity";

@Entity()
@ObjectType()
export class GameEntity extends BaseEntity implements IGame {
    @Field()
    @Unique()
    @Property()
    url!: string;

    @Field(() => [String])
    @Property()
    background: string[] = [];

    @Field(() => [String])
    @Property()
    assistant: string[] = [];

    @Field()
    @Property()
    twitter: string = "";

    @Field(() => [ItemEntity])
    @OneToMany(() => ItemEntity, item => item.game, {orphanRemoval: true})
    item = new Collection<ItemEntity>(this);

    @Field(() => [OptionEntity])
    @OneToMany(() => OptionEntity, option => option.game, {orphanRemoval: true})
    option = new Collection<OptionEntity>(this);

    @Field(() => [TagEntity])
    @OneToMany(() => TagEntity, tag => tag.game, {orphanRemoval: true})
    tag = new Collection<TagEntity>(this);
}
