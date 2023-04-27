import {Arg, Ctx, Mutation, Resolver} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context} from "../../../server";
import {DI} from "../../../orm";
import {ItemEntity} from "../../crud/item/item.entity";
import {TagEntity} from "../../crud/tag/tag.entity";
import {OptionEntity} from "../../crud/option/option.entity";
import {GameEntity} from "../../crud/game/game.entity";
import {assert} from "../../../helpers/assert";
import {BookingEntity} from "../../crud/booking/booking.entity";
import {SubscriptionEntity} from "../../crud/subscription/subscription.entity";
import {BookingMakeInput} from "./BookingMakeInput";
import {createBooking, getCurrency, getEmail, getGame, getOrCreateUser} from "./helpers";
import {buildItems, reconstructItems, stringifyItems, totalItems} from "./items";
import {notify} from "./notify";
import {payWithPaypal, payWithStripe} from "./method";

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
    async BookingMakeById(
        @Ctx() ctx: Context,
        @Arg("id") id: string,
        @Arg("method") method: string,
    ) {
        const bookingEntity = await this.bookRepo.findOne({id}, true);
        assert(bookingEntity, "order not found");
        assert(!bookingEntity.active, "order already purchased");

        const currencyRecord = getCurrency(bookingEntity.currency);
        const items = reconstructItems(bookingEntity.data, currencyRecord);

        const total = totalItems(items);

        notify(
            bookingEntity.info,
            items,
            currencyRecord,
            bookingEntity.user.email,
            method,
            total.discounted,
        );

        if (method === "stripe") {
            return await payWithStripe(
                bookingEntity.id,
                ``,
                bookingEntity.user.email,
                items,
            );
        } else {
            return await payWithPaypal(
                bookingEntity.id,
                ``,
                total,
                currencyRecord.id,
                items,
            );
        }
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

        const userEmail = await getEmail(email, ctx);
        const gameEntity = await getGame(game);

        const currencyRecord = getCurrency(currency);
        const user = await getOrCreateUser(userEmail);
        const items = await buildItems(
            user,
            game,
            booking,
            currencyRecord,
            subscription,
        );

        const total = totalItems(items, coupon);
        const data = stringifyItems(items);
        const bookingEntity = await createBooking(
            user,
            data,
            total.discounted,
            currencyRecord.id,
            info,
            gameEntity.name,
            subscription,
        );

        notify(
            info,
            items,
            currencyRecord,
            email,
            method,
            total.discounted,
            coupon,
        );

        return "null";

        // if (method === "stripe") {
        //     return await payWithStripe(
        //         bookingEntity.id,
        //         `${gameEntity.url}/`,
        //         email,
        //         items,
        //         coupon,
        //     );
        // } else {
        //     return await payWithPaypal(
        //         bookingEntity.id,
        //         `${gameEntity.url}/`,
        //         total,
        //         currencyRecord.id,
        //         items,
        //     );
        // }
    }
}
