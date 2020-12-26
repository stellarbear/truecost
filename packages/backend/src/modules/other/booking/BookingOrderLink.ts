import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {UserEntity} from "../../crud/user/user.entity";
import {Context} from "../../../server";
import {DI} from "../../../orm";
import {BookingEntity} from "../../crud/booking/booking.entity";
import {BookingOrderLinkInput} from "./BookingOrderLinkInput";
import {assert} from "../../../helpers/assert";
import {RoleType} from "@truecost/shared";
import {UseAuth} from "../../../middleware/auth";
import {clearDead, createBooking, getCurrency, getOrCreateUser} from "./helpers";

@Resolver()
export class BookingOrderLinkResolver {
    userRepo = DI.em.getRepository(UserEntity);
    bookRepo = DI.em.getRepository(BookingEntity);

    @UseMiddleware(UseAuth([RoleType.ADMIN]))
    @Mutation(() => String)
    async BookingCreateOrderLink(
        @Ctx() ctx: Context,
        @Arg("input") input: BookingOrderLinkInput,
    ) {
        const {
            data,
            email,
            info,
            game,
            currency,
            subscription,
        } = input;
        console.log("yooooooooooooooooooooooooooooooooo");

        const currencyRecord = getCurrency(currency);

        const user = await getOrCreateUser(email);

        await clearDead(user);
        console.log("yooooooooooooooooooooooooooooooooo");

        const total = this.getTotal(data);

        const bookingEntity = await createBooking(
            user,
            data,
            total,
            currencyRecord.id,
            info,
            game,
            subscription,
        );
        console.log("yooooooooooooooooooooooooooooooooo", bookingEntity);

        return bookingEntity.id;
    }

    private getTotal(data: string) {
        try {
            const items = JSON.parse(data);
            assert(items.length > 0, "order can not be empty");

            let result = 0;
            for (const item of items) {
                result += item.quantity * item.amount;
            }

            return result;
        } catch {
            assert(false, 'invalid data structure');
        }
    }
}
