import {AdminGame, AdminOption, AdminItem, AdminTag} from ".";
import {AdminBlog} from "./Blog";

const routes = [
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
];

export const admin = {routes};
