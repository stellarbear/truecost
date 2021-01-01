import {DI} from "../../orm";
import {BookingEntity} from "../crud/booking/booking.entity";
import {UserEntity} from "../crud/user/user.entity";
import {composeEmail} from "../../mail/compose";
import {accountEmail} from "../../mail/samples/account";
import {domain} from "../../helpers/route";
import {orderEmail} from "../../mail/samples/order";
import {SubscriptionEntity} from "../crud/subscription/subscription.entity";
import {slack} from "../../helpers/slack";
import {assert} from "../../helpers/assert";
import {Dict, SafeJSON, StatusType} from "@truecost/shared";
import {clearDead} from "./booking/helpers";

export const createOrder = async (id: string, method: string) => {
    console.log(id);

    const subsRepo = DI.em.getRepository(SubscriptionEntity);
    const bookRepo = DI.em.getRepository(BookingEntity);
    const userRepo = DI.em.getRepository(UserEntity);

    const currentBooking = await bookRepo.findOne({id}, true);
    assert(currentBooking, "order id not found, contact us.");
    assert(!currentBooking.active, "order id not found, contact us!");

    const currentUser = currentBooking.user;
    assert(currentUser, `user not found, contact us. order id: ${id}`);

    const subscriptionId = currentBooking.subscription;
    if (subscriptionId) {
        const subEntity = await subsRepo.findOne({id: subscriptionId});
        if (subEntity) {
            currentUser.subscription = subEntity;
            currentUser.subscribeDate = new Date();
        }

        await userRepo.persistAndFlush(currentUser);
    }

    currentBooking.status = StatusType.AWAITING_FOR_CONTACT;
    currentBooking.active = true;
    await bookRepo.persistAndFlush(currentBooking);

    await clearDead(currentUser);

    if (currentUser.active == false) {
        currentUser.active = true;

        await sendAccountInfo(currentUser.email, currentUser.name);

        currentUser.name = currentUser.email;
        await userRepo.persistAndFlush(currentUser);
    }
    await sendBookingInfo(
        currentUser,
        currentBooking,
    );

    notifyAboutBooking(
        currentUser,
        currentBooking,
        method,
    );

    return currentBooking;
};

const notifyAboutBooking = (
    user: UserEntity,
    booking: BookingEntity,
    method: string,
) => {
    const data = SafeJSON.parse<any[]>(booking.data, []);
    const info = SafeJSON.parse<Record<string, any>>(booking.info, {});

    slack([
        " ʕノ•ᴥ•ʔノ [PURCHASE SUCCESS]  \\(•ᴥ• \\)́",
        user.email,
        method,
        '--------',
        `code: ${booking.code}`,
        '--------',
        `total: ${booking.total} ${booking.currency}`,
        '--------',
        ...data.map(({name, quantity, description, amount}: any) =>
            `• ${name} x ${quantity}\n  price: ${amount} ${booking.currency}\n opts: ${description}`),
        '--------',
        `${Object.keys(info).map(key => `${key}: ${info[key] || "-"}`).join('\n')}`,
    ]);

};

const sendBookingInfo = async (
    user: UserEntity,
    booking: BookingEntity,
) => {
    try {
        const data = SafeJSON.parse<any[]>(booking.data, []);
        console.log('sending order receipt');
        await composeEmail({
            to: user.email,
            template: orderEmail(booking.code, {
                game: booking.game,
                total: `${booking.total} ${booking.currency}`,
                ...data.reduce((acc: Dict<string>, {name, quantity, description, amount}: any) => ({
                    ...acc,
                    [`${name} (${description})`]: `${amount} ${booking.currency} x ${quantity}`,
                }), {}),
            }),
            subject: 'Order receipt',
            text: `Order receipt for ${domain}`,
        });
    } catch (e) {
        console.log('ERROR', e);
    }
};

const sendAccountInfo = async (email: string, password: string) => {
    try {
        console.log('sending account info');
        await composeEmail({
            to: email,
            template: accountEmail(password),
            subject: 'New account',
            text: `New account for ${domain}`,
        });
    } catch (e) {
        console.log('ERROR', e);
    }
};
