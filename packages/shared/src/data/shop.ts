import {IGame, IItem, IOption, ISubscription, ITag, rangeBase} from "../interfaces";
import {arrayToDict, dictSortMap, ICartItem, OptionArea, OptionMerge, SafeJSON} from "..";
import {CalcPrice, CalcResult} from "../math";

export type Dict<T> = Record<string, T>;

export interface IShop {
    tags: {
        base: Array<string>;
        url: Dict<string>;
        id: Dict<ITag>;
    };
    options: {
        local: {
            id: Dict<IOption>;
            include: Set<string>;
            exclude: Set<string>;
        };
        global: {
            id: Dict<IOption>;
        };
    };
    items: {
        url: Dict<string>;
        id: Dict<IItem>;
    };

    getTagDeps(tagId: string): string[];

    getOptions(itemId: string): string[];

    getTotal(cart: Dict<ICartItem>, extra?: string[]): CalcResult;
}

export interface IGameContext {
    data: {
        id: Dict<IGame>;
        url: Dict<string>;
    };
}

export interface IShopContext {
    data: Dict<IShop>;
    subs: Dict<ISubscription>;
}

const map = (src: any) => src.getIdentifiers
    ? src.getIdentifiers()
    : Array.isArray(src)
        ? src.map((s: any) => s?.id)
        : [];

export const parseShop = (
    GameAll: IGame[], ItemAll: IItem[], TagAll: ITag[], OptionAll: IOption[],
    SubscriptionAll: ISubscription[],
) => {
    const gameDict: IGameContext = {data: {id: {}, url: {}}};
    const shopDict: IShopContext = {data: {}, subs: {}};

    for (const game of GameAll) {
        const {id: gameId, active, url} = game;
        if (active) {
            gameDict.data.id[gameId] = game;
            gameDict.data.url[url] = gameId;
        }
    }

    for (const sub of SubscriptionAll) {
        const {id: subId, active} = sub;
        if (active) {
            shopDict.subs[subId] = sub;
        }
    }

    for (const gameId in gameDict.data.id) {
        shopDict.data[gameId] = {
            tags: {id: {}, url: {}, base: []},
            options: {local: {include: new Set(), exclude: new Set(), id: {}}, global: {id: {}}},
            items: {url: {}, id: {}},
            getOptions(itemId: string) {
                const item = this.items.id[itemId];
                const options = this.options.local;

                const result = [];

                for (const optionId of item.option) {
                    if (options.include.has(optionId)) {
                        result.push(optionId);
                    }
                }

                options.exclude.forEach(optionId => {
                    if (!item.option.includes(optionId)) {
                        result.push(optionId);
                    }
                });

                return result;
            },

            getTotal(cart: Dict<ICartItem>, extra: string[] = []) {
                const items = this.items.id;
                const options = this.options.local.id;
                const global = this.options.global.id;

                let value = 0;

                for (const itemId in cart) {
                    const itemPrice = CalcPrice.fromItem(items[itemId], cart[itemId].chunk);
                    const totalPrice = CalcPrice.fromItemAndOptions(itemPrice,
                        cart[itemId].optionIds.map(o => options[o]));

                    value += totalPrice.value;
                }

                value = CalcPrice.fromItemAndOptions({value, string: ""}, extra.map(s => global[s])).value;
                const string = `${value} $`;

                return {value, string};
            },
            getTagDeps(tagId: string) {
                const result = new Set([tagId]);
                const tags = this.tags.id;

                if (!(tagId in tags)) {
                    return [];
                }

                const stack = [...tags[tagId].children];

                while (stack.length > 0) {
                    const nodeId = stack.pop();
                    if (nodeId) {
                        result.add(nodeId);
                        const {children} = tags[nodeId];

                        for (const child of children) {
                            if (!result.has(child)) {
                                stack.push(child);
                            }
                        }
                    }

                }

                return Array.from(result);
            },
        };
    }

    const sortedOptions = dictSortMap(arrayToDict(OptionAll, "id"));
    for (const option of sortedOptions) {
        const {game: {id: gameId}, area, id, active, merge} = option;
        if (active && gameId in shopDict.data) {
            if (area === OptionArea.GLOBAL) {
                shopDict.data[gameId].options.global.id[id] = option;
            } else if (area === OptionArea.LOCAL) {
                shopDict.data[gameId].options.local.id[id] = option;
                if (merge === OptionMerge.INCLUDE) {
                    shopDict.data[gameId].options.local.include.add(id);
                } else if (merge === OptionMerge.EXCLUDE) {
                    shopDict.data[gameId].options.local.exclude.add(id);
                }
            }
        }
    }

    for (const item of ItemAll) {
        const {game: {id: gameId}, id, active, url} = item;

        if (active && gameId in shopDict.data) {
            shopDict.data[gameId].items.url[url] = id;
            shopDict.data[gameId].items.id[id] = {
                ...item,
                tag: map(item.tag),
                item: map(item.item),
                option: map(item.option),
                range: SafeJSON.parse(item.range, rangeBase),
            };
        }
    }

    for (const tag of TagAll) {
        const {game: {id: gameId}, id, active, name} = tag;

        if (active && gameId in shopDict.data) {
            shopDict.data[gameId].tags.url[name] = id;
            shopDict.data[gameId].tags.id[id] = {
                ...tag,
                children: map(tag.children),
            };
        }
    }

    for (const game of GameAll) {
        const {id: gameId, active} = game;

        if (active) {
            const store = shopDict.data[gameId].tags;

            const tagBaseArray = Object.keys(store.id);
            const tagBaseCandidates = new Set(tagBaseArray);

            for (const tag of tagBaseArray) {
                const children = shopDict.data[gameId].getTagDeps(tag);
                for (const child of children) {
                    if (child !== tag) {
                        tagBaseCandidates.delete(child);
                    }
                }
            }

            store.base = Array.from(tagBaseCandidates);
        }
    }

    return ({
        shop: shopDict,
        game: gameDict,
    });
};
