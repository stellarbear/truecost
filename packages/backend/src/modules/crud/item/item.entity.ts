import {MetaEntity} from "../base/base.entity";
import {Collection, Entity, ManyToMany, ManyToOne, Property} from "mikro-orm";
import {TagEntity} from "../tag/tag.entity";
import {OptionEntity} from "../option/option.entity";
import {CategoryEntity} from "../category/category.entity";
import {GameEntity} from "../game/game.entity";
import {Field, Int, ObjectType} from "type-graphql";

@Entity()
@ObjectType()
export class ItemEntity extends MetaEntity {
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
    tag: Collection<TagEntity> = new Collection<TagEntity>(this);

    @Field(() => [OptionEntity])
    @ManyToMany(() => OptionEntity, option => option.item, {owner: true})
    option: Collection<OptionEntity> = new Collection<OptionEntity>(this);

    @Field(() => [CategoryEntity])
    @ManyToMany(() => CategoryEntity, category => category.item, {owner: true})
    category: Collection<CategoryEntity> = new Collection<CategoryEntity>(this);

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);
}
