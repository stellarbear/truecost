import {Collection, EntityRepository, wrap} from "@mikro-orm/core";
import {assert} from "../../../helpers/assert";
import {DI} from "../../../orm";
import {UploadType} from "../../../scalars";
import {FileUpload} from "graphql-upload";
import {Media} from "../../../helpers/media";
import {v4} from "uuid";
import {ObjectID} from "mongodb";

const convert = (src: Record<string, any>, type: "set" | "like" | "between" | "filter") => {
    switch (type) {
        case "set":
            return Object.keys(src).map(key => ({[key]: {$eq: src[key]}}));
        case "like":
            return Object.keys(src).map(key => ({[key]: {$regex: src[key], $options: 'i'}}));
        case "filter":
            return Object.keys(src).map(key => ({
                [key]: {
                    $in:
                        Array.isArray(src[key])
                            ? src[key].map((key: any) => new ObjectID(key))
                            : [new ObjectID(src[key])],
                },
            }));
        case "between":
            return Object.keys(src).map(key => {
                const from = +src[key][0];
                const to = +src[key][1];

                return ({
                    [key]: {
                        ...(to != undefined ? {$lte: to} : {}),
                        ...(from != undefined ? {$gte: from} : {}),
                    },
                });
            });
        default:
            return [];
    }
};

export abstract class BaseService<T> {
    constructor(
        public readonly repository: EntityRepository<T>,
    ) {
    }

    async id(id: string) {
        const result = await this.repository.findOne({id} as any);
        assert(result, "not found");
        return result;
    }

    async all() {
        const result = await this.repository.findAll({populate: false, orderBy: {order: "ASC"}});

        return result;
    }

    async get({
                  skip = 0,
                  take = 1,
                  set = {},
                  like = {},
                  between = {},
                  filter = {},
              }) {
        const sub = [
            ...convert(set, "set"),
            ...convert(like, "like"),
            ...convert(filter, "filter"),
            ...convert(between, "between"),
        ];
        const query: any = sub.length > 0 ? {$and: sub} : {};
        console.log(JSON.stringify(query));

        const [items, count] = await this.repository.findAndCount(query, {
            limit: take || undefined,
            offset: skip,
            populate: true,
        });
        return {items, count};
    }

    async delete(
        id: string,
    ) {
        const query: any = {id};
        const item = await this.repository.findOne(query, {populate: true});
        assert(item, "id not found");

        await Media.removeDir(id);
        this.repository.removeAndFlush(item);
    }

    async unique(
        input: Record<string, any>,
        unique: string[],
    ) {
        const result = [];
        const restrictions = input.id ? {id: {$ne: input.id}} : {};

        for (const field of unique) {
            if (field in input) {
                const [, count] = await this.repository.findAndCount({[field]: input[field], ...restrictions as any});

                if (count > 0) {
                    result.push(field);
                }
            }
        }

        return result;
    }

    async upsert(
        input: Record<string, any>,
        images: string[] = [],
        relations: string[],
    ) {
        const item = await this.item(input.id);
        assert(item, "id not found");

        try {
            await this.upload(item, input, images);

            //  M:N propagation cheat
            for (const relation of relations) {
                if (relation in item && relation in input) {
                    const relatives = await DI.em.find(DI.map[relation], {id: {$in: input[relation] || []}});
                    ((item as any)[relation] as Collection<any>).set(relatives);
                }
            }

            wrap(item).assign(input, {em: DI.em});

            await this.repository.persistAndFlush(item);
        } catch (e) {
            console.log(e);
        }

        return item;
    }

    private async item(id: string) {
        if (id) {
            return await this.repository.findOne({id} as any, {populate: true});
        } else {
            const dummy = this.repository.create({});
            await this.repository.persistAndFlush(dummy);
            return dummy;
        }
    }

    private async upload(
        item: T,
        input: Record<string, any>,
        images: string[] = [],
    ) {
        const itemId = (item as any).id;

        for (const imageKey of images) {
            if (imageKey in input) {
                const oldImages = input[imageKey].filter((p: UploadType) => typeof p === "string") as string[];
                const newImages = input[imageKey].filter((p: UploadType) => typeof p !== "string") as FileUpload[];
                const deprecatedImages = ((item as any)[imageKey] || [])
                    .filter((p: string) => !oldImages.includes(p)) as string[];

                deprecatedImages.forEach(p => Media.removeDir(itemId, p));

                for (const newImage of newImages) {
                    const id = v4();
                    oldImages.push(id);
                    await Media.upload(newImage, itemId, id);
                }

                input[imageKey] = oldImages;
            }
        }

        return input;
    }
}
