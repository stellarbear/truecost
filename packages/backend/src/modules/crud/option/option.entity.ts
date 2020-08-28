import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, Enum, ManyToMany, ManyToOne, Property} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";
import {BaseEntity} from "../base/base.entity";
import {IOption, OptionArea, OptionMerge, OptionType} from "@truecost/shared";

@Entity()
@ObjectType()
export class OptionEntity extends BaseEntity implements IOption {
    @Field()
    @Property()
    price: number = 1;
    @Field()
    @Property()
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
