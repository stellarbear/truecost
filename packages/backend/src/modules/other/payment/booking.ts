import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context, sessionCookieName} from "../../../server";
import {redis} from "../../../redis";
import {DI} from "../../../orm";
import {ItemEntity} from "../../crud/item/item.entity";
import {TagEntity} from "../../crud/tag/tag.entity";
import {OptionEntity} from "../../crud/option/option.entity";
import {GameEntity} from "../../crud/game/game.entity";
import {parseShop, IItem, parseCart, SafeJSON, Price} from "@truecost/shared";
import {backend, frontend} from "../../../helpers/route";
import {creds} from "../../../helpers/creds";
import Stripe from 'stripe';
import {assert} from "../../../helpers/assert";
import {BookingEntity} from "../../crud/booking/booking.entity";


//TODO: session middleware
@Resolver()
export class BookingResolver {
    tagRepo = DI.em.getRepository(TagEntity);
    gameRepo = DI.em.getRepository(GameEntity);
    userRepo = DI.em.getRepository(UserEntity);
    itemRepo = DI.em.getRepository(ItemEntity);
    optionRepo = DI.em.getRepository(OptionEntity);
    bookRepo = DI.em.getRepository(BookingEntity);

    @Query(() => BookingEntity)
    async BookingGetByCode(
        @Arg("email") email: string,
        @Arg("code") code: string,
    ) {
        const user = await this.userRepo.findOne({email});
        assert(user, "order not found", ["code"]);

        const booking = await this.bookRepo.findOne({code, user});
        assert(booking, "order not found", ["code"]);

        return booking;
    }

    @Mutation(() => String)
    async BookingMake(
        @Ctx() ctx: Context,
        @Arg("game") game: string,
        @Arg("email") email: string,
        @Arg("order") order: string,
        @Arg("info") info: string,
    ) {
        console.log("arrived <----------------------------------------")
        const userEmail = await this.getEmail(ctx, email);
        const gameEntiry = await this.gameRepo.findOne({id: game});
        assert(gameEntiry, "invalid game");

        const GameAll = await this.gameRepo.findAll({populate: true});
        const ItemAll = await this.itemRepo.findAll({populate: true});
        const TagAll = await this.tagRepo.findAll({populate: true});
        const OptionAll = await this.optionRepo.findAll({populate: true});
        DI.em.clear();

        const {shop} = parseShop(
            GameAll, ItemAll as any, TagAll, OptionAll
        );

        const store = shop.data[game];
        const items = store.items.id;
        const optionsLocal = store.options.local.id;
        const optionsGlobal = store.options.global.id;
        const cart = parseCart(store, SafeJSON.parse(order, {}));

        const total = store.getTotal(cart.local);

        const line_items = [];
        //  items
        line_items.push(...Object.keys(cart.local).map(key => {
            const cartItem = cart.local[key];
            const {itemId, chunk, quantity, optionIds} = cartItem;
            const item = items[itemId];
            const options = optionIds.map(o => optionsLocal[o])

            const name = item.name + (item.range.length > 0 ? ` ${chunk?.join(' - ')}` : '');
            const description = options.map(o => o.name).join(', ') || "-";
            const images = item.images.map(i => `${backend.uri}/${item.id}/${i}/u.png`);
            const amount = Price.fromItem(item, chunk).withOption(options).toValue * 100

            return (
                {
                    name,
                    quantity,
                    currency: 'usd',
                    description,
                    images,
                    amount
                }
            )

        }))

        //  global options
        line_items.push(...cart.global.map(globalId => {
            const option = optionsGlobal[globalId];

            const name = option.name;
            const quantity = 1;
            const images: string[] = []
            const amount = total.getOption(option).toValue * 100
            return (
                {
                    name,
                    quantity,
                    currency: 'usd',
                    images,
                    amount
                }
            )
        }));

        const stripe = new Stripe(creds("stripe").sk, {apiVersion: '2020-03-02'});
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            customer_email: email,
            metadata: {info, game, email: userEmail},
            locale: "en",
            line_items,
            success_url: `${frontend.uri}/${gameEntiry?.url}/checkout/success`,
            cancel_url: `${frontend.uri}/${gameEntiry?.url}/checkout`
        });
        return session.id
    }

    private async getEmail(ctx: Context, email: string): Promise<string> {
        const sid = ctx.req.session?.sid;
        if (!sid) {
            return email
        }

        const userId = await redis.client.get(`session-${sid}`);
        if (!userId) {
            return email
        }

        const user = await DI.userRepo.findOne({id: userId});
        if (!user) {
            return email;
        }

        assert(user.active, "account disabled");
        return user.email;
    }

}