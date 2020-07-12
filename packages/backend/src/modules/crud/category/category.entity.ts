import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne, OneToMany} from "mikro-orm";
import {GameEntity} from "../game/game.entity";
import {BaseEntity} from "../base/base.entity";
import {ICategory} from "@truecost/shared";

@Entity()
@ObjectType()
export class CategoryEntity extends BaseEntity implements ICategory {
    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => CategoryEntity, {nullable: true})
    @ManyToOne(() => CategoryEntity)
    parent!: CategoryEntity;
}
