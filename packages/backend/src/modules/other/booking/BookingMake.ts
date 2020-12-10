import {Arg, Ctx, Mutation, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context} from "../../../server";
import {redis} from "../../../redis";
import {DI} from "../../../orm";
import {ItemEntity} from "../../crud/item/item.entity";
import {TagEntity} from "../../crud/tag/tag.entity";
import {OptionEntity} from "../../crud/option/option.entity";
import {GameEntity} from "../../crud/game/game.entity";
import {
    parseCart, parseShop, SafeJSON, subscription as subscrMath,
    CalcPrice, Currencies, CurrencyKey,
} from "@truecost/shared";
import {backend, frontend} from "../../../helpers/route";
import {creds} from "../../../helpers/creds";
import Stripe from 'stripe';
import {assert} from "../../../helpers/assert";
import {BookingEntity} from "../../crud/booking/booking.entity";
import {SubscriptionEntity} from "../../crud/subscription/subscription.entity";
import {slack} from "../../../helpers/slack";
import {BookingMakeInput} from "./BookingMakeInput";

@Resolver()
export class BookingMakeResolver {
    tagRepo = DI.em.getRepository(TagEntity);
    gameRepo = DI.em.getRepository(GameEntity);
    userRepo = DI.em.getRepository(UserEntity);
    itemRepo = DI.em.getRepository(ItemEntity);
    optionRepo = DI.em.getRepository(OptionEntity);
    bookRepo = DI.em.getRepository(BookingEntity);
    subsRepo = DI.em.getRepository(SubscriptionEntity);

    @Mutation(() => String)
    async BookingMake(
        @Ctx() ctx: Context,
        @Arg("input") input: BookingMakeInput,
    ) {
        const {
            game, email, booking, method,
            info, currency, coupon, subscription,
        } = input;

        const userEmail = await this.getEmail(ctx, email);
        const gameEntiry = await this.gameRepo.findOne({id: game});
        assert(gameEntiry, "invalid game");

        assert(currency in Currencies, `invalid currency ${currency}`);
        const currencyValue = currency as CurrencyKey;
        const currencyRecord = Currencies[currencyValue];

        const GameAll = await this.gameRepo.findAll();
        const ItemAll = await this.itemRepo.findAll();
        const TagAll = await this.tagRepo.findAll();
        const OptionAll = await this.optionRepo.findAll();
        const SubscriptionAll = await this.subsRepo.findAll();
        DI.em.clear();

        const {shop} = parseShop(
            GameAll, ItemAll as any, TagAll as any, OptionAll, SubscriptionAll,
        );

        //  get discount or subscription
        const user = await this.userRepo.findOne({email: userEmail}, {populate: true});
        const subscriptionDiscount = subscrMath.validate(user as any);
        const sub = subscriptionDiscount ? null : (subscription || null);
        const discount = 100 - ((
            !!subscriptionDiscount
                ? subscriptionDiscount
                : (await this.subsRepo.findOne({id: sub}))?.discount) || 0);

        //
        const store = shop.data[game];
        const items = store.items.id;
        const optionsLocal = store.options.local.id;
        const optionsGlobal = store.options.global.id;
        const cart = parseCart(store, SafeJSON.parse(booking, {}));
        const localCartPrice = store.getTotal(cart.local, currencyRecord);

        const line_items = [];
        //  items
        line_items.push(...Object.keys(cart.local).map(key => {
            const cartItem = cart.local[key];
            const {itemId, chunk, quantity, optionIds} = cartItem;
            const item = items[itemId];
            const options = optionIds.map(o => optionsLocal[o]);

            const name = item.name + (item.range.d.length > 0 ? ` ${chunk?.join(' - ')}` : '');
            const description = options.map(o => o.name).join(', ') || "-";
            const images = item.images.map(i => `${backend.uri}/${itemId}/${i}/u.png`);

            const itemPrice = CalcPrice.fromItem(item, currencyRecord, chunk);
            const totalPrice = CalcPrice.fromItemAndOptions(itemPrice, currencyRecord, options);
            const amount = Math.floor(CalcPrice.percentage(totalPrice.value * 100, discount));

            return (
                {
                    name,
                    quantity,
                    currency,
                    description,
                    images,
                    amount: amount > 0 ? amount : 1,
                }
            );

        }));

        //  global options
        line_items.push(...cart.global.map(globalId => {
            const option = optionsGlobal[globalId];

            const name = option.name;
            const quantity = 1;
            const images: string[] = [];
            const optionPrice = CalcPrice.fromOption(localCartPrice, currencyRecord, option);
            const amount = Math.floor(CalcPrice.percentage(optionPrice.value * 100, discount));
            return (
                {
                    name,
                    quantity,
                    currency,
                    description: '-',
                    images,
                    amount: amount > 0 ? amount : 1,
                }
            );
        }));

        //  subscription
        if (sub) {
            const subEntity = await this.subsRepo.findOne({id: sub});
            if (subEntity) {
                const {name, price} = subEntity;
                const adjustedSubscriptionPrice =
                    CalcPrice.applyCurrency(price, currencyRecord);

                line_items.push({
                    name,
                    quantity: 1,
                    currency,
                    description: 'discount plan',
                    amount: adjustedSubscriptionPrice * 100,
                });
            }
        }

        const information: Record<string, any> = SafeJSON.parse(info, {});
        slack([
            " (╯°□°)╯ [purchase attempt] ...",
            coupon || "-",
            currency,
            method,
            email,
            ...line_items.map(({name, quantity, amount, description}) =>
                `• ${name} x ${quantity}\n  price: ${amount / 100} ${currencyRecord.label}\n opts: ${description}`),
            '--------',
            `${Object.keys(information).map(key => `${key}: ${information[key] || "-"}`).join('\n')}`,
        ]);

        if (method === "stripe") {
            const stripe = new Stripe(creds("stripe").sk, {apiVersion: '2020-08-27'});
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                customer_email: email,
                ...(coupon ? {
                    discounts: [{
                        coupon,
                    }],
                } : {}),
                metadata: {info, game: gameEntiry.name, email: userEmail, subscription: sub, currency},
                locale: "en",
                line_items,
                success_url: `${frontend.uri}/${gameEntiry.url}/checkout/success`,
                cancel_url: `${frontend.uri}/${gameEntiry.url}/checkout`,
            });
            return session.id;
        } else {
            return "";
        }
    }

    private async getEmail(ctx: Context, email: string): Promise<string> {
        const {id} = ctx.req.session;
        if (!id) {
            return email;
        }

        const userId = await redis.client.get(`session-${id}`);
        if (!userId) {
            return email;
        }

        const user: any = await DI.em.findOne(DI.map.user, {id: userId});
        if (!user) {
            return email;
        }

        assert(user.active, "account disabled");
        return user.email;
    }
}