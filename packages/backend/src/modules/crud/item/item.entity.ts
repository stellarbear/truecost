import {BaseEntity} from "../base/base.entity";
import {Collection, Entity, ManyToMany, ManyToOne, Property, Unique} from "@mikro-orm/core";
import {TagEntity} from "../tag/tag.entity";
import {OptionEntity} from "../option/option.entity";
import {GameEntity} from "../game/game.entity";
import {Field, Int, ObjectType} from "type-graphql";
import {rangeBase} from "@truecost/shared";

const rangeBaseJson = JSON.stringify(rangeBase);

@Entity()
@ObjectType()
export class ItemEntity extends BaseEntity /*implements IItem */ {
    @Field()
    @Unique()
    @Property()
    url!: string;
    @Field()
    @Property()
    link: string = "";

    @Field(() => [String])
    @Property()
    images: string[] = [];


    @Field(() => Int, {defaultValue: 0})
    @Property({default: 0})
    rate: number = 0;
    @Field(() => Int, {defaultValue: 0})
    @Property({default: 0})
    buy: number = 0;
    @Field(() => Int)
    @Property()
    eta: number = 60;
    @Field(() => Int)
    @Property()
    price: number = 1;
    @Field({defaultValue: rangeBaseJson})
    @Property()
    range: string = rangeBaseJson;

    @Field(() => Int)
    @Property()
    discount: number = 0;
    @Field(() => Int)
    @Property()
    limit: number = 0;


    @Field()
    @Property()
    obtain: string = "";

    @Field()
    @Property()
    requirements: string = "";

    @Field()
    @Property()
    topOffer: boolean = false;
    @Field({defaultValue: false})
    @Property()
    direct: boolean = false;


    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => [TagEntity])
    @ManyToMany(() => TagEntity, tag => tag.item, {owner: true})
    tag = new Collection<TagEntity>(this);

    @Field(() => [OptionEntity])
    @ManyToMany(() => OptionEntity, option => option.item, {owner: true})
    option = new Collection<OptionEntity>(this);

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);
}
