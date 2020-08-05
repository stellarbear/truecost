import {IUser, ISubscription} from "../interfaces";

export const subscriptionVaildate = (user?:IUser, subsription?: ISubscription) => {
    if (!user || !user.subscribeDate || !subsription) {
        return false;
    }

    const minimumDate = new Date(new Date().setDate(new Date().getDate() - subsription.days));
    return user.subscribeDate > minimumDate;
}