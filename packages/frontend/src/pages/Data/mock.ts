import {IGame, IShop} from "@truecost/shared";

const defaultGame: IGame = {
    id: "truecost",
    url: "",
    seo: "",
    order: 0,
    name: "truecost",
    active: false,
    twitter: "truecost",
    background: [""],
    assistant: [""],
    preview: [""],
};

const defaultShop: IShop = {
    tags: {
        base: [],
        url: {},
        id: {},
    },
    options: {
        local: {
            id: {},
            include: new Set(),
            exclude: new Set(),
        },
        global: {
            id: {},
        },
    },
    items: {
        url: {},
        id: {},
    },

    getTagDeps: () => [],

    getOptions: () => [],

    getTotal: () => ({
        value: 0,
        string: "",
    }),
};

export const mock = {defaultGame, defaultShop};