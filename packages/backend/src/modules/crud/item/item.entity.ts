import {BaseMetaEntity} from "../base/base.entity";
import {Collection, Entity, ManyToMany, ManyToOne, Property, Cascade} from "mikro-orm";
import {TagEntity} from "../tag/tag.entity";
import {OptionEntity} from "../option/option.entity";
import {GameEntity} from "../game/game.entity";
import {Field, Int, ObjectType} from "type-graphql";
import {IItem} from "@truecost/shared";

@Entity()
@ObjectType()
export class ItemEntity extends BaseMetaEntity /*implements IItem */ {
    @Field()
    @Property()
    //  Hyperlink to light.gg
    link: string = "";

    @Field(() => [String])
    @Property()
    images: string[] = [];


    @Field(() => Int)
    @Property()
    price: number = 1;

    @Field({defaultValue: "[]"})
    @Property()
    range: string = "[]";

    @Field({defaultValue: false})
    @Property()
    //  Show on the first page
    single: boolean = false;

    @Field(() => Int)
    @Property()
    discount: number = 0;

    @Field(() => Int)
    @Property()
    //  Limit number of items for puchuase (0 for no restriction)
    limit: number = 0;


    @Field()
    @Property()
    //  Item description field
    obtain: string = "";

    @Field()
    @Property()
    //  Item description field
    requirements: string = "";

    @Field()
    @Property()
    //  Show on the first page
    topOffer: boolean = false;


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
