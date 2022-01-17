import {
    parseCart, parseShop, SafeJSON, subscription as subscrMath,
    CalcPrice, ICurrency,
} from "@truecost/shared";
import {assert} from "../../../helpers/assert";
import {backend} from "../../../helpers/route";
import {DI} from "../../../orm";
import {GameEntity} from "../../crud/game/game.entity";
import {ItemEntity} from "../../crud/item/item.entity";
import {OptionEntity} from "../../crud/option/option.entity";
import {SubscriptionEntity} from "../../crud/subscription/subscription.entity";
import {TagEntity} from "../../crud/tag/tag.entity";
import {UserEntity} from "../../crud/user/user.entity";
import {IItemShape} from "./helpers";

export const reconstructItems = (
    data: string,
    currency: ICurrency,
): IItemShape[] => {
    try {
        const parsed = JSON.parse(data);
        assert(parsed.length > 0, "order can not be empty");

        const result: IItemShape[] = [];

        for (const {amount, quantity, name, description} of parsed) {
            result.push(
                {
                    name,
                    quantity,
                    currency: currency.id,
                    description,
                    images: [],
                    amount,
                },
            );
        }

        return result;
    } catch {
        assert(false, 'invalid data structure');
    }
};

export const buildItems = async (
    user: UserEntity,
    game: string,
    booking: string,
    currency: ICurrency,
    subscription?: string,
): Promise<IItemShape[]> => {
    const gameRepo = DI.em.getRepository(GameEntity);
    const itemRepo = DI.em.getRepository(ItemEntity);
    const tagRepo = DI.em.getRepository(TagEntity);
    const optionRepo = DI.em.getRepository(OptionEntity);
    const subsRepo = DI.em.getRepository(SubscriptionEntity);

    const GameAll = await gameRepo.findAll();
    const ItemAll = await itemRepo.findAll();
    const TagAll = await tagRepo.findAll();
    const OptionAll = await optionRepo.findAll();
    const SubscriptionAll = await subsRepo.findAll();
    DI.em.clear();

    const {shop} = parseShop(
        GameAll, ItemAll as any, TagAll as any, OptionAll, SubscriptionAll,
    );

    const subscriptionDiscount = subscrMath.validate(user as any);
    const sub = subscriptionDiscount ? null : (subscription || null);
    const discount = 100 - ((
        !!subscriptionDiscount
            ? subscriptionDiscount
            : (await subsRepo.findOne({id: sub}))?.discount) || 0);

    //
    const store = shop.data[game];
    const items = store.items.id;
    const optionsLocal = store.options.local.id;
    const optionsGlobal = store.options.global.id;
    const cart = parseCart(store, SafeJSON.parse(booking, {}));
    const localCartPrice = store.getTotal(cart.local, currency);

    const result = [];
    //  items
    result.push(...Object.keys(cart.local).map(key => {
        const cartItem = cart.local[key];
        const {itemId, chunk, quantity, optionIds} = cartItem;
        const item = items[itemId];
        const options = optionIds.map(o => optionsLocal[o]);

        const name = item.name + (item.range.d.length > 0 ? ` ${chunk?.join(' - ')}` : '');
        const description = options.map(o => o.name).join(', ') || "-";
        const images = item.images.map(i => `${backend.uri}/${itemId}/${i}/u.png`);

        const itemPrice = CalcPrice.fromItem(item, currency, chunk);
        const totalPrice = CalcPrice.fromItemAndOptions(itemPrice, currency, options);
        const amount = Math.floor(CalcPrice.percentage(totalPrice.value, discount));

        return (
            {
                name,
                quantity,
                currency: currency.id,
                description,
                images,
                amount: amount > 0 ? amount : 1,
            }
        );

    }));

    //  global options
    result.push(...cart.global.map(globalId => {
        const option = optionsGlobal[globalId];

        const name = option.name;
        const quantity = 1;
        const images: string[] = [];
        const optionPrice = CalcPrice.fromOption(localCartPrice, currency, option);
        const amount = Math.floor(CalcPrice.percentage(optionPrice.value, discount));
        return (
            {
                name,
                quantity,
                currency: currency.id,
                description: '-',
                images,
                amount: amount > 0 ? amount : 1,
            }
        );
    }));

    //  subscription
    if (sub) {
        const subEntity = await subsRepo.findOne({id: sub});
        if (subEntity) {
            const {name, price} = subEntity;
            const adjustedSubscriptionPrice =
                CalcPrice.applyCurrency(price, currency);

            result.push({
                name,
                quantity: 1,
                currency: currency.id,
                description: 'discount plan',
                amount: adjustedSubscriptionPrice,
            });
        }
    }
    assert(result.length > 0, "order can not be empty");

    return result;
};

export const totalItems = (
    items: IItemShape[],
    coupon?: string,
) => {
    const total = items.reduce((acc, {
        amount,
        quantity,
    }) => acc + amount * quantity, 0);

    const discounted =
        (coupon === "SUBS") ? CalcPrice.percentage(total, 90)
            : (coupon === "HENRISOMAD") ? CalcPrice.percentage(total, 88)
                : total;

    const discount = total - discounted;

    return {total, discount, discounted};
};

export const stringifyItems = (
    items: IItemShape[],
) => {
    const result = items.map(({amount, quantity, name, description}) => ({
        amount,
        quantity,
        name,
        description,
    }));

    return JSON.stringify(result);
};
