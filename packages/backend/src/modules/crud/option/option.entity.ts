import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, Enum, ManyToMany, ManyToOne, Property} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";
import {BaseEntity} from "../base/base.entity";
import {OptionArea, OptionFilter, OptionType} from "@truecost/shared";

@Entity()
@ObjectType()
export class OptionEntity extends BaseEntity {
    @Field()
    @Property()
    price: number = 1;
    @Field()
    @Property()
        //  price from which option becomes free (0 for no limit)
    free: number = 0;


    @Field()
    @Enum(() => OptionType)
    type: OptionType = OptionType.NOMINAL;
    @Field()
    @Enum(() => OptionArea)
    area: OptionArea = OptionArea.LOCAL;
    @Field()
    @Enum(() => OptionFilter)
    filter: OptionFilter = OptionFilter.INCLUDE;


    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;
    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity, item => item.option, {default: []})
    item = new Collection<ItemEntity>(this);
}
