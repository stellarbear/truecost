import {Arg, ClassType, Int, Mutation, Query, Resolver, UseMiddleware} from "type-graphql";
import {BaseService} from "./base.service";
import {assert} from "../../../helpers/assert";
import {BaseEntity} from "./base.entity";
import {BaseInput} from "./base.input";
import {UseAuth} from "../../../middleware/auth";
import {isArray, isString} from "../../../helpers/is";
import {RoleType} from "@truecost/shared";

const filterInput = <V>(input: V, array: Array<keyof V>) => {
    if (array.length === 0) {
        return {};
    }

    const result: Record<string, any> = {};
    for (const key of array) {
        if (key in input) {
            result[key as string] = input[key];
        }
    }

    return result;
};

interface IBaseResolver<T, I, R, V> {
    classRef: T;
    inputRef: I;
    resultRef: R;
    get: {
        set?: Array<keyof V>;
        like?: Array<keyof V>;
        between?: Array<keyof V>;
        filter?: Array<keyof V>;
    };
    upsert: {
        notEmpty: Array<keyof V>;
        unique?: Array<keyof V>;
        images?: Array<keyof V>;
    };
    restrictPublic?: boolean;
    prefix?: string;
}

export function BaseResolver<T extends typeof BaseEntity,
    I extends typeof BaseInput,
    R extends ClassType<unknown>,
    V extends { id?: string }>(
    {
        inputRef,
        classRef,
        resultRef,
        get: {
            set = [],
            like = [],
            filter = [],
            between = [],
        },
        upsert: {
            notEmpty,
            unique = [],
            images = [],
        },
        restrictPublic = true,
        prefix = classRef.name.replace('Entity', ""),
    }: IBaseResolver<T, I, R, V>): any {

    @Resolver(() => resultRef, {isAbstract: true})
    abstract class BaseResolverClass {
        constructor(protected readonly service: BaseService<T>) {
        }

        @UseMiddleware(UseAuth([RoleType.ADMIN]))
        @Query(() => resultRef, {name: `${prefix}Get`})
        async get(
            @Arg('skip', () => Int, {defaultValue: 0}) skip: number,
            @Arg('take', () => Int, {defaultValue: 1}) take: number,
            @Arg('input', () => inputRef) input: V,
        ): Promise<R> {
            const result = await this.service.get({
                skip, take,
                set: filterInput(input, set),
                like: filterInput(input, like),
                between: filterInput(input, between),
                filter: filterInput(input, filter),
            });
            return result as any;
        }

        @UseMiddleware(UseAuth([RoleType.ADMIN]))
        @Mutation(() => String, {name: `${prefix}Delete`})
        async delete(@Arg('input', () => inputRef) {id}: V): Promise<string> {
            assert(id, "id must be specified");
            await this.service.delete(id);
            return id;
        }

        @UseMiddleware(UseAuth([RoleType.ADMIN]))
        @Mutation(() => classRef, {name: `${prefix}Upsert`})
        async upsert(@Arg('input', () => inputRef) input: V): Promise<T> {
            const emptyValues = notEmpty.filter(key =>
                (isArray(input[key]) || isString(input[key])) ? (input[key] as any).length == 0
                    : input[key] == undefined);
            assert(emptyValues.length === 0, "must not be empty", emptyValues);

            const nonUniqueValues = await this.service.unique(input, unique as string[]);
            assert(nonUniqueValues.length === 0, "must be unique", nonUniqueValues);

            const item = await this.service.upsert(input, images as string[]);
            return item;
        }

        @Query(() => [classRef], {name: `${prefix}All`})
        async all(): Promise<T[]> {
            assert(!restrictPublic, "not permitted");
            return await this.service.all();
        }

        @Query(() => classRef, {name: `${prefix}Id`})
        async id(@Arg('id') id: string): Promise<T> {
            assert(!restrictPublic, "not permitted");
            return await this.service.id(id);
        }
    }

    return BaseResolverClass;
}
