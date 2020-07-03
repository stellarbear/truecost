import {PrimaryKey, Property, SerializedPrimaryKey, Unique} from "mikro-orm";
import {ObjectId} from "mongodb";
import {Field, Int, ObjectType} from "type-graphql";

@ObjectType({isAbstract: true})
export abstract class BaseEntity {
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
    order: number = 0;
}

@ObjectType({isAbstract: true})
export abstract class MetaEntity extends BaseEntity {
    @Field()
    @Unique()
    @Property()
    url!: string;
}
