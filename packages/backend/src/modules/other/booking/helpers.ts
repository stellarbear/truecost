import {wrap} from "@mikro-orm/core";
import {Currencies, CurrencyKey, RoleType, StatusType} from "@truecost/shared";
import {pbkdf2} from "../../../helpers/pbkdf2";
import {generateString} from "../../../helpers/generate";
import {UserEntity} from "../../crud/user/user.entity";
import {assert} from "../../../helpers/assert";
import {Context} from "../../../server";
import {redis} from "../../../redis";
import {DI} from "../../../orm";
import {GameEntity} from "../../crud/game/game.entity";
import {BookingEntity} from "../../crud/booking/booking.entity";

export interface IItemShape {
    name: string;
    quantity: number;
    currency: CurrencyKey;
    description: string;
    images?: string[];
    amount: number;
}

export const getOrCreateUser = async (
    email: string,
) => {
    const repo = DI.em.getRepository(UserEntity);

    let user = await repo.findOne({email});
    if (user) {
        return user;
    }

    user = repo.create({});

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

    await repo.persistAndFlush(user);

    return user;
};

export const getCurrency = (currency: string) => {
    assert(currency in Currencies, `invalid currency ${currency}`);
    const currencyValue = currency as CurrencyKey;
    const currencyRecord = Currencies[currencyValue];

    return currencyRecord;
};

export const getGame = async (
    game: string) => {
    const repo = DI.em.getRepository(GameEntity);

    const gameEntity = await repo.findOne({id: game});
    assert(gameEntity, "invalid game");
    return gameEntity;
};

export const getEmail = async (input: string, ctx?: Context) => {
    const email = input.trim().toLocaleLowerCase();

    if (!ctx) {
        return email;
    }

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
};

export const createBooking = async (
    user: UserEntity,
    data: string,
    total: number,
    currency: string,
    info: string,
    game: string,
    subscription?: string,
) => {
    const repo = DI.em.getRepository(BookingEntity);

    const code = "TC-" + generateString({length: 8, num: true, upper: true, lower: false});

    const currentBooking = repo.create({
        active: false,
        name: "TC-" + (await repo.count({})),
        status: StatusType.AWAITING_FOR_PAYMENT,

        user: user.id,

        total,
        currency,
        code,

        subscription,

        info,
        game,
        data,
    });

    await repo.persistAndFlush(currentBooking);

    return currentBooking;
};

export const clearDead = async (
    currentUser: UserEntity,
) => {
    const repo = DI.em.getRepository(BookingEntity);

    const deadOrders = await repo.find({
        user: currentUser,
        status: StatusType.AWAITING_FOR_PAYMENT,
    });

    for (const dead of deadOrders) {
        await repo.removeAndFlush(dead);
    }
};