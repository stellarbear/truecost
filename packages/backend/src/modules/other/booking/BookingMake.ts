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
    CalcPrice, Currencies, CurrencyKey, RoleType, StatusType, ICurrency,
} from "@truecost/shared";
import {backend, frontend} from "../../../helpers/route";
import {creds} from "../../../helpers/creds";
import Stripe from 'stripe';
import {assert} from "../../../helpers/assert";
import {BookingEntity} from "../../crud/booking/booking.entity";
import {SubscriptionEntity} from "../../crud/subscription/subscription.entity";
import {slack} from "../../../helpers/slack";
import {BookingMakeInput} from "./BookingMakeInput";
import * as paypal from '@paypal/checkout-server-sdk';
import {pbkdf2} from "../../../helpers/pbkdf2";
import {generateString} from "../../../helpers/generate";
import {wrap} from "@mikro-orm/core";

interface IItemShape {
    name: string;
    quantity: number;
    currency: CurrencyKey;
    description: string;
    images?: string[];
    amount: number;
}

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
    async BookingTest(
        @Ctx() ctx: Context,
    ) {
        const clientId = "ASFQP0-fmmeTUQAdfRTutwcNzD9vx_ijLEt1uEP-CNk6suUj73NM0wVXzrlt0mO0dLCcfARt-T8YuS7o";
        const clientSecret = "EJDlGhFmkm17Fopzr9LwGVjuzSKCoj0U6gQ1WpFf4xuWkzrxQbjSR3-ObevxGDUFPuKiCJ2aEVw7X1p1";
        const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        const client = new paypal.core.PayPalHttpClient(environment);

        const request = new paypal.orders.OrdersCreateRequest();
        request.requestBody({
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {
                        "currency_code": "USD",
                        "value": "20",
                        "breakdown": {
                            "item_total": {
                                "value": '30',
                                "currency_code": "USD",
                            },
                            "discount": {
                                "currency_code": "USD",
                                "value": "10.00",
                            },
                        },
                    },
                    "items": [{
                        "name": "item 1",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "10",
                        },
                        "quantity": 1,
                    }, {
                        "name": "item 2",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "10",
                        },
                        "quantity": 2,
                    }],
                },
            ],
            "application_context": {
                locale: "en-US",
                landing_page: "BILLING",
                brand_name: "TrueCostGG",
                user_action: "PAY_NOW",
                shipping_preference: "NO_SHIPPING",
                return_url: `${frontend.uri}/d2/checkout/paypal`,
                cancel_url: `${frontend.uri}/d2/checkout`,
            },
        });
        const response = await client.execute(request);

        const approval = response.result.links.filter((link: any) => link.rel === 'approve');
        assert(approval.length === 1, "paypal order failure (code: no approval)");
        return approval[0].href;
    }

    @Mutation(() => Boolean)
    async BookingPaypalAccept(
        @Ctx() ctx: Context,
        @Arg("token") token: string,
    ) {
        console.log(token);
        const clientId = "ASFQP0-fmmeTUQAdfRTutwcNzD9vx_ijLEt1uEP-CNk6suUj73NM0wVXzrlt0mO0dLCcfARt-T8YuS7o";
        const clientSecret = "EJDlGhFmkm17Fopzr9LwGVjuzSKCoj0U6gQ1WpFf4xuWkzrxQbjSR3-ObevxGDUFPuKiCJ2aEVw7X1p1";
        const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
        const client = new paypal.core.PayPalHttpClient(environment);
        const confirm = new paypal.orders.OrdersCaptureRequest(token);

        const confirmResponse = await client.execute(confirm);
        console.log(`Response: ${JSON.stringify(confirmResponse)}`);
        console.log(`Capture: ${JSON.stringify(confirmResponse.result)}`);

        assert(confirmResponse.result.status === "COMPLETED", "paypal order failure (code: payment not processed)");

        const order = new paypal.orders.OrdersGetRequest(token);
        const orderResponse = await client.execute(order);
        console.log(`Response: ${JSON.stringify(orderResponse)}`);
        console.log(`Capture: ${JSON.stringify(orderResponse.result)}`);

        return true;
    }

    @Mutation(() => String)
    async BookingMake(
        @Ctx() ctx: Context,
        @Arg("input") input: BookingMakeInput,
    ) {
        const {
            game, email, booking, method,
            info, currency, coupon, subscription,
        } = input;

        console.log('make');
        const userEmail = await this.getEmail(ctx, email);
        const gameEntity = await this.gameRepo.findOne({id: game});
        assert(gameEntity, "invalid game");

        assert(currency in Currencies, `invalid currency ${currency}`);
        const currencyValue = currency as CurrencyKey;
        const currencyRecord = Currencies[currencyValue];

        console.log('user');
        const user = await this.userRepo.findOne({email: userEmail})
            ?? (await this.createUser(userEmail));

        console.log('items');
        const items = await this.buildItems(
            user,
            game,
            booking,
            currencyRecord,
            subscription,
        );

        assert(items.length > 0, "order can not be empty");
        console.log('total');
        const total = this.totalItems(items, coupon);

        console.log('booking');
        const bookingEntity = await this.createBooking(
            user,
            items,
            total.discounted,
            currencyRecord.id,
            info,
            gameEntity.name,
            subscription,
        );
        /*
                this.notify(
                    info,
                    items,
                    currencyRecord,
                    email,
                    method,
                    coupon
                )
        */
        console.log('method');
        if (method === "stripe") {
            const {sk} = creds("stripe");
            const stripe = new Stripe(sk, {apiVersion: '2020-08-27'});
            console.log('session');
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                customer_email: email,
                ...(coupon ? {
                    discounts: [{
                        coupon,
                    }],
                } : {}),
                metadata: {id: bookingEntity.id},
                locale: "en",
                line_items: items.map(item => ({
                    ...item,
                    amount: item.amount * 100,
                })),
                success_url: `${frontend.uri}/${gameEntity.url}/checkout/success`,
                cancel_url: `${frontend.uri}/${gameEntity.url}/checkout`,
            });
            console.log('session id');
            return session.id;
        } else {
            const {id, secret} = creds("paypal");
            console.log(id, secret);
            const environment = new paypal.core.SandboxEnvironment(id, secret);
            const client = new paypal.core.PayPalHttpClient(environment);

            console.log('request');
            const request = new paypal.orders.OrdersCreateRequest();
            const currency = currencyRecord.id;
            request.requestBody({
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": currency,
                            "value": total.discounted,
                            "breakdown": {
                                "item_total": {
                                    "value": total.total,
                                    "currency_code": currency,
                                },
                                ...total.discount ? {
                                    "discount": {
                                        "currency_code": currency,
                                        "value": total.discount,
                                    },
                                } : {},
                            },
                        },
                        "invoice_id": bookingEntity.id,
                        "items":
                            items.map(({name, quantity, amount, currency}) => ({
                                name,
                                unit_amount: {
                                    "currency_code": currency,
                                    "value": amount,
                                },
                                quantity,
                            })),
                    },
                ],
                "application_context": {
                    locale: "en-US",
                    landing_page: "BILLING",
                    brand_name: "TrueCostGG",
                    user_action: "PAY_NOW",
                    shipping_preference: "NO_SHIPPING",
                    return_url: `${frontend.uri}/${gameEntity.url}/checkout/paypal`,
                    cancel_url: `${frontend.uri}/${gameEntity.url}/checkout`,
                },
            });

            console.log('response');
            const response = await client.execute(request);

            console.log('approval');
            const approval = response.result.links.filter((link: any) => link.rel === 'approve');
            assert(approval.length === 1, "paypal order failure (code: no approval)");
            return approval[0].href;
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

    private async createUser(email: string) {
        const user = this.userRepo.create({});

        const password = generateString({length: 8});
        const {hash, salt} = await pbkdf2.generate(password);

        wrap(user).assign({
            role: RoleType.USER,
            verified: true,
            password: hash,
            active: false,
            email,
            name: password,
            salt,
        });

        await this.userRepo.persistAndFlush(user);

        return user;
    }

    private totalItems(items: IItemShape[], coupon?: string) {
        const total = items.reduce((acc, {
            amount,
            quantity,
        }) => acc + amount * quantity, 0);

        const discounted = (coupon === "SUBS")
            ? CalcPrice.percentage(total, 90)
            : total;

        const discount = total - discounted;

        return {total, discount, discounted};
    }

    private async buildItems(
        user: UserEntity,
        game: string,
        booking: string,
        currency: ICurrency,
        subscription?: string,
    ): Promise<IItemShape[]> {
        const GameAll = await this.gameRepo.findAll();
        const ItemAll = await this.itemRepo.findAll();
        const TagAll = await this.tagRepo.findAll();
        const OptionAll = await this.optionRepo.findAll();
        const SubscriptionAll = await this.subsRepo.findAll();
        DI.em.clear();

        const {shop} = parseShop(
            GameAll, ItemAll as any, TagAll as any, OptionAll, SubscriptionAll,
        );

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
            const subEntity = await this.subsRepo.findOne({id: sub});
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

        return result;
    }

    private async createBooking(
        user: UserEntity,
        items: IItemShape[],
        total: number,
        currency: string,
        info: string,
        game: string,
        subscription?: string,
    ) {
        const code = "TC-" + generateString({length: 8, num: true, upper: true, lower: false});

        const data = items.map(({amount, quantity, name, description}) => ({
            amount,
            quantity,
            name,
            description,
        }));

        const currentBooking = this.bookRepo.create({
            active: false,
            name: "TC-" + (await this.bookRepo.count({})),
            status: StatusType.AWAITING_FOR_CONTACT,

            user: user.id,

            total,
            currency,
            code,

            subscription,

            info,
            game,
            data: JSON.stringify(data),
        });

        await this.bookRepo.persistAndFlush(currentBooking);

        return currentBooking;
    }

    private notify(
        info: string,
        items: IItemShape[],
        currency: ICurrency,
        email: string,
        method: string,
        coupon?: string,
    ) {

        const information: Record<string, any> = SafeJSON.parse(info, {});

        slack([
            " (╯°□°)╯ [purchase attempt] ...",
            coupon || "-",
            currency.id,
            method,
            email,
            ...items.map(({name, quantity, amount, description}) =>
                `• ${name} x ${quantity}\n  price: ${amount / 100} ${currency.label}\n opts: ${description}`),
            '--------',
            `${Object.keys(information).map(key => `${key}: ${information[key] || "-"}`).join('\n')}`,
        ]);
    }
}
