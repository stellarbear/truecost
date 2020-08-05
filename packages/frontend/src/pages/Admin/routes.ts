import {AdminGame, AdminOption, AdminItem, AdminTag} from ".";
import {AdminBlog} from "./Blog";
import {AdminBooking} from "./Booking";
import {AdminInfo} from "./Info";
import {AdminSubscription} from "./Subscription";

const routes = [
    {
        url: "booking",
        component: AdminBooking,
    },
    {
        url: "blog",
        component: AdminBlog,
    },
    {
        url: "game",
        component: AdminGame,
    },
    {
        url: "option",
        component: AdminOption,
    },
    {
        url: "tag",
        component: AdminTag,
    },
    {
        url: "item",
        component: AdminItem,
    },
    {
        url: "info",
        component: AdminInfo,
    },
    {
        url: "subscription",
        component: AdminSubscription,
    },
];

export const admin = {routes};
