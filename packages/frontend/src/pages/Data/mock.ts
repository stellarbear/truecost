import {IGame, IShop, Dict, ICartItem} from "@truecost/shared";

const defaultGame: IGame = {
    id: "truecost",
    url: "",
    order: 0,
    name: "truecost",
    active: false,
    twitter: "truecost",
    background: [""],
    assistant: [""],
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

    getTagDeps: (tagId: string) => [],

    getOptions: (itemId: string) => [],

    getTotal: (cart: Dict<ICartItem>, extra?: string[]) => ({
        value: 0,
        string: "",
    })
}

export const mock = {defaultGame, defaultShop};