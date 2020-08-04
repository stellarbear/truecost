import {AdminGame, AdminOption, AdminItem, AdminTag} from ".";
import {AdminBlog} from "./Blog";
import {AdminBooking} from "./Booking";
import {AdminInfo} from "./Info";

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
];

export const admin = {routes};
