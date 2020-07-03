import {ClassType, Field, Int, ObjectType} from "type-graphql";

export function PaginatedResponse<T>(classRef: ClassType<T>): any {
    @ObjectType({isAbstract: true})
    abstract class PaginatedResponseClass {
        @Field(() => [classRef])
        items!: T[];

        @Field(() => Int)
        count!: number;
    }

    return PaginatedResponseClass;
}
