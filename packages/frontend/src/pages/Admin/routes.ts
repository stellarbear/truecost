import {AdminGame, AdminItem, AdminOption, AdminTag} from ".";
import {AdminBlog} from "./Blog";
import {AdminBooking} from "./Booking";
import {AdminInfo} from "./Info";
import {AdminSubscription} from "./Subscription";
import {AdminMeta} from "./Meta";
import {AdminReview} from "./Review";
import { AdminConfig } from "./Config";

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
        url: "meta",
        component: AdminMeta,
    },
    {
        url: "review",
        component: AdminReview,
    },
    {
        url: "subscription",
        component: AdminSubscription,
    },
    {
        url: "config",
        component: AdminConfig,
    },
];

export const admin = {routes};
