import {IUser} from "../interfaces";

const validate = (user?: IUser | null) => {
    if (!user || !user.subscribeDate || !user.subscription) {
        return 0;
    }

    const minimumDate = new Date(new Date().setDate(new Date().getDate() - user.subscription.days));
    return user.subscribeDate > minimumDate ? user.subscription.discount : 0;
};

const timeLeft = (user?: IUser | null) => {
    if (user?.subscription && user.subscribeDate) {
        if (!validate) {
            return 0;
        }

        const oneDay = 24 * 60 * 60 * 1000;
        const payDate = +user.subscribeDate;
        const minimumDate = +new Date(new Date().setDate(new Date().getDate() - user.subscription.days));

        return Math.round(Math.abs((payDate - minimumDate) / oneDay));
    }

    return 0;
};

export const subscription = {validate, timeLeft};
