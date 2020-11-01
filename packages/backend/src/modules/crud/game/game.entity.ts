import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, OneToMany, Property, Unique} from "mikro-orm";
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

    @Field(() => [String], {defaultValue: []})
    @Property()
    preview: string[] = [];

    @Field(() => [String], {defaultValue: []})
    @Property()
    background: string[] = [];

    @Field(() => [String], {defaultValue: []})
    @Property()
    assistant: string[] = [];

    @Field()
    @Property()
    twitter: string = "";

    @Field({defaultValue: ""})
    @Property({default: ""})
    seo: string = "";

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
