import {PrimaryKey, Property, SerializedPrimaryKey, Unique} from "@mikro-orm/core";
import {ObjectId} from "mongodb";
import {Field, Int, ObjectType} from "type-graphql";
import {IBase} from "@truecost/shared";

@ObjectType({isAbstract: true})
export abstract class BaseEntity implements IBase {
    @Unique()
    @PrimaryKey()
    _id!: ObjectId;

    @Field()
    @SerializedPrimaryKey()
    id!: string;

    @Property()
    createdAt = new Date();

    @Property({onUpdate: () => new Date()})
    updatedAt = new Date();

    @Field()
    @Property()
    active: boolean = false;

    @Field()
    @Unique()
    @Property()
    name!: string;

    @Field(() => Int)
    @Property()
    order = 0;
}