import {CalcPrice, CalcResult} from "@truecost/shared";
import {IDataContext} from "pages/Data/Wrapper";

export interface ITotalInput {
    store: IDataContext;
    selected?: string;
    current?: string;
}

export interface ITotalResult {
    price: number;
    adjustedSubscriptionPrice: number;
    subscriptionDiscount: number;
    cartPrice: CalcResult;
}

export const calcTotal = (
    {store, selected, current}: ITotalInput,
): ITotalResult => {
    const {subs, current: {cart, shop}, currency} = store;

    const cartItems = cart();

    const [subscriptionPrice, subscriptionDiscount] = current
        ? [0, subs[current].discount]
        : selected
            ? [subs[selected].price, subs[selected].discount]
            : [0, 0];

    const adjustedSubscriptionPrice =
        CalcPrice.applyCurrency(subscriptionPrice, currency);

    const cartPrice = shop().getTotal(cartItems.local, currency, cartItems.global);

    const total = CalcPrice.round(CalcPrice.percentage(cartPrice.value, 100 - subscriptionDiscount) +
        adjustedSubscriptionPrice);

    return {
        price: total,
        subscriptionDiscount,
        adjustedSubscriptionPrice,
        cartPrice,
    };
};

export const getQueryStringParams = (query: string) => {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query)
            .split('&')
            .reduce((params, param) => {
                const [key, value] = param.split('=');
                params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                return params;
            }, {} as Record<string, any>,
            )
        : {};
};