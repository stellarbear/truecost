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

interface ICRUDGet<V> {
    set?: Array<keyof V>;
    like?: Array<keyof V>;
    between?: Array<keyof V>;
    filter?: Array<keyof V>;
};

interface ICRUDUpsert<V> {
    notEmpty?: Array<keyof V>;
    unique?: Array<keyof V>;
    images?: Array<keyof V>;
    propagate?: Array<keyof V>;
};

interface ICRUDResolver<T, I, R, V> {
    classRef: T;
    inputRef: I;
    resultRef: R;
    get: ICRUDGet<V>;
    upsert: ICRUDUpsert<V>;
    restrictPublic?: boolean;
    prefix?: string;
}

const merge = <T, U extends T>(src: {[K in keyof T]: T[K][]}, dst: {[K in keyof U]: U[K][]}) => {
    for (let key in src) {
        if (key in dst) {
            src[key].push(...(dst[key] || []));
        }
    }

    return src;
}

export function BaseResolver<T extends typeof BaseEntity,
    I extends typeof BaseInput,
    R extends ClassType<unknown>,
    V extends BaseInput>({get, upsert, ...rest}: ICRUDResolver<T, I, R, Omit<V, keyof BaseInput>>): any {

    const baseGet: Required<ICRUDGet<BaseInput>> = {
        set: ["active"],
        between: ["order"],
        like: ["name"],
        filter: [],
    };
    const baseUpsert: Required<ICRUDUpsert<BaseInput>> = {
        notEmpty: ["active", "name"],
        unique: [],
        images: [],
        propagate: []
    };

    return CRUDResolver<T, I, R, V>({
        ...rest,
        get: merge(baseGet, get as any),
        upsert: merge(baseUpsert, upsert as any),
    })
}

export function CRUDResolver<T extends typeof BaseEntity,
    I extends typeof BaseInput,
    R extends ClassType<unknown>,
    V extends {id?: string}>(
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
                notEmpty = [],
                unique = [],
                images = [],
                propagate = []
            },
            restrictPublic = true,
            prefix = classRef.name.replace('Entity', ""),
        }: ICRUDResolver<T, I, R, V>): any {

    @Resolver(() => resultRef, {isAbstract: true})
    abstract class CRUDResolverClass {
        constructor(protected readonly service: BaseService<T>) {
        }

        @UseMiddleware(UseAuth([RoleType.ADMIN]))
        @Query(() => resultRef, {name: `${prefix}Get`})
        async get(
            @Arg('skip', () => Int, {defaultValue: 0}) skip: number,
            @Arg('take', () => Int, {defaultValue: 0}) take: number,
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
            console.log('delete arrived-----------------------------', id)
            assert(id, "id must be specified");
            await this.service.delete(id);
            return id;
        }

        @UseMiddleware(UseAuth([RoleType.ADMIN]))
        @Mutation(() => classRef, {name: `${prefix}Upsert`})
        async upsert(@Arg('input', () => inputRef) input: V): Promise<T> {
            console.log('upsert arrived-----------------------------', input)
            const emptyValues = notEmpty.filter(key =>
                (isArray(input[key]) || isString(input[key])) ? (input[key] as any).length == 0
                    : input[key] == undefined);
            assert(emptyValues.length === 0, "must not be empty", emptyValues);

            const nonUniqueValues = await this.service.unique(input, unique as string[]);
            assert(nonUniqueValues.length === 0, "must be unique", nonUniqueValues);

            const item = await this.service.upsert(input, images as string[], propagate as string[]);
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

    return CRUDResolverClass;
}
