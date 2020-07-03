import {MetaEntity} from "../base/base.entity";
import {Field, Float, ObjectType} from "type-graphql";
import {Entity, Property} from "mikro-orm";


@Entity()
@ObjectType()
export class BlogEntity extends MetaEntity {
    @Field(() => Float)
    @Property()
    date: number = new Date().getTime();

    @Field()
    @Property()
    preview: string = "";

    @Field()
    @Property()
    text: string = "";

    @Field(() => [String])
    @Property()
    images: string[] = [];
}
