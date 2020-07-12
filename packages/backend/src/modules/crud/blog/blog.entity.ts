import {BaseMetaEntity} from "../base/base.entity";
import {Field, Float, ObjectType} from "type-graphql";
import {Entity, Property} from "mikro-orm";
import { IBlog } from "@truecost/shared"


@Entity()
@ObjectType()
export class BlogEntity extends BaseMetaEntity implements IBlog {
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
