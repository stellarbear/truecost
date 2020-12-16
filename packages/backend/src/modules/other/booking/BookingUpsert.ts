import {Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context} from "../../../server";
import {DI} from "../../../orm";
import {ItemEntity} from "../../crud/item/item.entity";
import {TagEntity} from "../../crud/tag/tag.entity";
import {OptionEntity} from "../../crud/option/option.entity";
import {GameEntity} from "../../crud/game/game.entity";
import {BookingEntity} from "../../crud/booking/booking.entity";
import {SubscriptionEntity} from "../../crud/subscription/subscription.entity";
import {BookingUpsertInput} from "./BookingUpsertInput";
import {assert} from "../../../helpers/assert";
import {wrap} from "@mikro-orm/core";
import {RoleType} from "@truecost/shared";
import {UseAuth} from "../../../middleware/auth";


@Resolver()
export class BookingUpsertResolver {
    tagRepo = DI.em.getRepository(TagEntity);
    gameRepo = DI.em.getRepository(GameEntity);
    userRepo = DI.em.getRepository(UserEntity);
    itemRepo = DI.em.getRepository(ItemEntity);
    optionRepo = DI.em.getRepository(OptionEntity);
    bookRepo = DI.em.getRepository(BookingEntity);
    subsRepo = DI.em.getRepository(SubscriptionEntity);

    @UseMiddleware(UseAuth([RoleType.ADMIN]))
    @Mutation(() => BookingEntity)
    async BookingUpsertManually(
        @Ctx() ctx: Context,
        @Arg("input") input: BookingUpsertInput,
    ) {
        const {
            id, total, data, pi,
            info, game, currency,
        } = input;

        if (id) {
            const booking = await this.bookRepo.findOne({id});
            assert(booking, "order not found");

            wrap(booking).assign({
                total, pi, info, currency,
                data: JSON.stringify({data: JSON.parse(data), game}),
            });

            await this.bookRepo.persistAndFlush(booking);

            return booking;
        } else {
            assert(false, "creation disabled");
            //  Transform items to webhook format

            /*
            const booking = await createOrder({
                amount_total: total,
                display_items,
                payment_intent: pi,
                metadata: {
                    info,
                    game,
                    email,
                    subscription,
                    currency,
                },
            });
            */
        }
    }
}
