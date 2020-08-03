import {BaseMetaEntity} from "../base/base.entity";
import {Collection, Entity, ManyToMany, ManyToOne, Property, Cascade} from "mikro-orm";
import {TagEntity} from "../tag/tag.entity";
import {OptionEntity} from "../option/option.entity";
import {GameEntity} from "../game/game.entity";
import {Field, Int, ObjectType} from "type-graphql";
import {IRange, rangeBase} from "@truecost/shared";

const rangeBaseJson = JSON.stringify(rangeBase)

@Entity()
@ObjectType()
export class ItemEntity extends BaseMetaEntity /*implements IItem */ {
    @Field()
    @Property()
    link: string = "";

    @Field(() => [String])
    @Property()
    images: string[] = [];


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


    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => [TagEntity])
    @ManyToMany(() => TagEntity, tag => tag.item)
    tag = new Collection<TagEntity>(this);

    @Field(() => [OptionEntity])
    @ManyToMany(() => OptionEntity, option => option.item)
    option = new Collection<OptionEntity>(this);

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);
}
