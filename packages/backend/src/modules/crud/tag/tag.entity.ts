import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";
import {ITag} from "@truecost/shared";

@Entity()
@ObjectType()
export class TagEntity extends BaseEntity implements ITag {
    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity, item => item.tag)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);
}
