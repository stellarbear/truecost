import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne, Property} from "@mikro-orm/core";
import {ItemEntity} from "../item/item.entity";
import {TagEntity} from "../tag/tag.entity";
import {GameEntity} from "../game/game.entity";

@Entity()
@ObjectType()
export class InfoEntity extends BaseEntity {
    @Field({defaultValue: ''})
    @Property({default: ''})
    cta: string = "";
    @Field()
    @Property()
    text: string = "";
    @Field()
    @Property()
    redirect: string = "";
    @Field(() => [String])
    @Property()
    images: string[] = [];

    @Field(() => GameEntity, {nullable: true})
    @ManyToOne(() => GameEntity, {nullable: true})
    game?: GameEntity;
    @Field(() => [ItemEntity], {nullable: true})
    @ManyToMany(() => ItemEntity)
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);
    @Field(() => [TagEntity], {nullable: true})
    @ManyToMany(() => TagEntity)
    tag: Collection<TagEntity> = new Collection<TagEntity>(this);
}
