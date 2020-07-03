import {BaseEntity} from "../base/base.entity";
import {Field, ObjectType} from "type-graphql";
import {Collection, Entity, ManyToMany, ManyToOne, Property} from "mikro-orm";
import {ItemEntity} from "../item/item.entity";
import {CategoryEntity} from "../category/category.entity";
import {TagEntity} from "../tag/tag.entity";

@Entity()
@ObjectType()
export class InfoEntity extends BaseEntity {

    @Field()
    @Property()
    text: string = "";

    @Field()
    @Property()
    redirect: string = "";

    @Field()
    @Property()
    image: string = "";


    @Field(() => CategoryEntity, {nullable: true})
    @ManyToOne()
    category!: CategoryEntity;

    @Field(() => [ItemEntity], {nullable: true})
    @ManyToMany()
    item: Collection<ItemEntity> = new Collection<ItemEntity>(this);

    @Field(() => [TagEntity], {nullable: true})
    @ManyToMany()
    tag: Collection<TagEntity> = new Collection<TagEntity>(this);
}
