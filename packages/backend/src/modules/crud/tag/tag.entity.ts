import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne, Property} from "@mikro-orm/core";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";

@Entity()
@ObjectType()
export class TagEntity extends BaseEntity /*implements ITag*/ {
    @Field({defaultValue: ""})
    @Property({default: ""})
    color: string = "";

    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity, item => item.tag)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);

    @Field(() => [TagEntity], {defaultValue: []})
    @ManyToMany(() => TagEntity)
    children: Collection<TagEntity> = new Collection<TagEntity>(this);
}
