import {AccountOrder} from "./AccountOrders";
import {AccountInfo} from "./AccountInfo";

const routes = [
    {
        url: "order",
        component: AccountOrder,
    },
    {
        url: "info",
        component: AccountInfo,
    },
];

export const account = {routes};
