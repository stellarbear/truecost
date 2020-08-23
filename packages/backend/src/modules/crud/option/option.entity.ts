import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, Enum, ManyToMany, ManyToOne, Property, Cascade} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";
import {BaseEntity} from "../base/base.entity";
import {OptionArea, OptionType, IOption, OptionMerge} from "@truecost/shared";

@Entity()
@ObjectType()
export class OptionEntity extends BaseEntity implements IOption {
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
    @Field({defaultValue: OptionMerge.INCLUDE})
    @Enum(() => OptionMerge)
    merge: OptionMerge = OptionMerge.INCLUDE;


    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity, item => item.option)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);
}
