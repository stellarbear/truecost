import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne, OneToMany} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {GameEntity} from "../game/game.entity";
import {BaseEntity} from "../base/base.entity";

@Entity()
@ObjectType()
export class CategoryEntity extends BaseEntity {
    @Field(() => GameEntity)
    @ManyToOne(() => GameEntity)
    game!: GameEntity;

    @Field(() => CategoryEntity, {nullable: true})
    @ManyToOne(() => CategoryEntity)
    parent!: CategoryEntity;

    @Field(() => [CategoryEntity], {nullable: true})
    @OneToMany(() => CategoryEntity, category => category.parent, {default: []})
    children: Collection<CategoryEntity> = new Collection<CategoryEntity>(this);

    @Field(() => [ItemEntity])
    @ManyToMany(() => ItemEntity, item => item.category, {default: []})
    item = new Collection<ItemEntity>(this);
}
