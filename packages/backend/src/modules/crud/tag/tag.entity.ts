import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";

@Entity()
@ObjectType()
export class TagEntity extends BaseEntity {
    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;
}
