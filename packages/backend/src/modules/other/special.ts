import {Mutation, Resolver, UseMiddleware} from "type-graphql";
import {DI} from "../../orm";
import {RoleType} from "@truecost/shared";
import {UseAuth} from "../../middleware/auth";
import {ItemEntity} from "../crud/item/item.entity";
import {redis} from "../../redis";

const random = (input: number) => {
    const buy = input || 1;

    if (buy <= 5) {
        return buy * 5;
    }

    const rand = Math.random() * 10;
    if (rand < 5) {
        return buy * 5;
    } else if (rand <= 5) {
        return Math.floor(buy * 4.9);
    } else if (rand <= 6) {
        return Math.floor(buy * 4.8);
    } else if (rand <= 7) {
        return Math.floor(buy * 4.7);
    } else if (rand <= 8) {
        return Math.floor(buy * 4.6);
    } else {
        return Math.floor(buy * 4.5);
    }
};

@Resolver()
export class SpecialResolver {
    itemRepo = DI.em.getRepository(ItemEntity);

    @UseMiddleware(UseAuth([RoleType.ADMIN]))
    @Mutation(() => [ItemEntity])
    async Special() {
        const items = await this.itemRepo.findAll();

        for (const item of items) {
            item.buy = item.buy || 0;
            item.direct = item.direct || false;
            item.rate = random(item.buy);
            await this.itemRepo.persistAndFlush(item);
        }

        await redis.client.del("cache");
        return items;
    }
}
