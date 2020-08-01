import {DI} from "../../orm";
import {generateString} from "../../helpers/generate";
import {BookingEntity} from "../crud/booking/booking.entity";
import {GameEntity} from "../crud/game/game.entity";
import {assert} from "../../helpers/assert";
import {UserEntity} from "../crud/user/user.entity";
import {pbkdf2} from "../../helpers/pbkdf2";
import {wrap, EntityRepository} from "mikro-orm";
import {RoleType, StatusType} from "@truecost/shared";
import {TagEntity} from "../crud/tag/tag.entity";
import {composeEmail} from "../../mail/compose";
import {accountEmail} from "../../mail/samples/account";
import {domain} from "../../helpers/route";
import {orderEmail} from "../../mail/samples/order";

export const createOrder = async (response: Record<string, any>) => {
    const {
        amount_total,
        display_items,
        payment_intent,
        metadata: {
            info,
            game,
            email
        }
    } = response;

    const data = display_items.map(({amount, quantity, custom: {name, description}}: any) => ({
        amount,
        quantity,
        name,
        description
    }))

    const bookRepo = DI.em.getRepository(BookingEntity);
    const gameRepo = DI.em.getRepository(GameEntity);
    const userRepo = DI.em.getRepository(UserEntity);

    const currentGame = await gameRepo.findOne({id: game}, {populate: false});
    assert(currentGame, "game not found");

    const currentUser = (await userRepo.findOne({email})) ?? (await createUser(userRepo, email))

    const code = "TC-" + generateString({length: 8, num: true, upper: true, lower: false});
    const currentBooking = bookRepo.create({
        active: true,
        name: "TC-" + (await bookRepo.count({})),
        status: StatusType.AWAITING_FOR_CONTACT,

        user: currentUser.id,

        total: amount_total,
        pi: payment_intent,
        code,

        info,
        data: JSON.stringify({game: currentGame.name, data}),
    });

    await bookRepo.persistAndFlush(currentBooking);

    try {
        await composeEmail({
            to: email,
            template: orderEmail(code, {
                ["game"]: currentGame.name,
                ["total"]: amount_total + " $",
            }),
            subject: 'New account',
            text: `New account for ${domain}`
        })
    } catch (e) {
        console.log(e);
    }
}

const createUser = async (repo: EntityRepository<UserEntity>, email: string) => {
    const user = repo.create({});

    const password = generateString({length: 8});
    //TODO: send password
    const {hash, salt} = await pbkdf2.generate(password);

    wrap(user).assign({
        role: RoleType.ANON,
        verified: false,
        password: hash,
        active: true,
        email,
        name: email,
        salt,
    });

    await repo.persistAndFlush(user);

    try {
        await composeEmail({
            to: email,
            template: accountEmail(password),
            subject: 'New account',
            text: `New account for ${domain}`
        })
    } catch (e) {
        console.log(e);
    }

    return user;
}