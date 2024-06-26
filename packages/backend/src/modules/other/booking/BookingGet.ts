import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { UserEntity } from "../../crud/user/user.entity";
import { Context } from "../../../server";
import { redis } from "../../../redis";
import { DI } from "../../../orm";
import { StatusType } from "@truecost/shared";
import { assert } from "../../../helpers/assert";
import { BookingEntity } from "../../crud/booking/booking.entity";

@Resolver()
export class BookingGetResolver {
    userRepo = DI.em.getRepository(UserEntity);
    bookRepo = DI.em.getRepository(BookingEntity);

    @Query(() => BookingEntity)
    async BookingGetByCode(
        @Arg("email") email: string,
        @Arg("code") code: string,
    ) {
        const user = await this.userRepo.findOne({ email });
        assert(user, "order not found", ["code"]);

        const booking = await this.bookRepo.findOne({ code, user });
        assert(booking, "order not found", ["code"]);

        return booking;
    }

    @Query(() => BookingEntity)
    async BookingGetById(
        @Arg("id") id: string,
    ) {
        const booking = await this.bookRepo.findOne({ id });
        assert(booking, "Order not found. Contact us for details!");
        assert(booking.active === false, "Order is not valid. Contact us!");
        assert(booking.status === StatusType.AWAITING_FOR_PAYMENT, "Order is already paid.");

        return booking;
    }

    @Query(() => [BookingEntity])
    async UserGetBooking(
        @Ctx() ctx: Context,
    ) {
        assert(ctx.req.session, "user not found");
        const userId = await redis.client.get(`session-${ctx.req.session.id}`);
        assert(userId, "user not found");
        const booking = await this.bookRepo.find({ user: userId });

        return booking;
    }
}
