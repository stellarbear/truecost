import {IGame, IItem, ITag, IOption} from "../interfaces";
import {Price, OptionArea, OptionMerge, SafeJSON, ICartItem} from "..";

export type Dict<T> = Record<string, T>;

export interface IShop {
    tags: {
        base: Array<string>,
        url: Dict<string>,
        id: Dict<ITag>
    }
    options: {
        local: {
            id: Dict<IOption>,
            include: Set<string>,
            exclude: Set<string>,
        }
        global: {
            id: Dict<IOption>
        }
    }
    items: {
        url: Dict<string>,
        id: Dict<IItem>
    }

    getTagDeps(tagId: string): string[]
    getOptions(itemId: string): string[]
    getTotal(cart: Dict<ICartItem>): Price
}

export interface IGameContext {
    data: {
        id: Dict<IGame>,
        url: Dict<string>,
    }
}
export interface IShopContext {
    data: Dict<IShop>
}

export const parseShop = (GameAll: IGame[], ItemAll: IItem[], TagAll: ITag[], OptionAll: IOption[]) => {
    const gameDict: IGameContext = {data: {id: {}, url: {}}};
    for (let game of GameAll) {
        let {id: gameId, active, url} = game;
        if (active) {
            gameDict.data.id[gameId] = game;
            gameDict.data.url[url] = gameId;
        }
    }

    const shopDict: IShopContext = {data: {}};
    for (let gameId in gameDict.data.id) {
        shopDict.data[gameId] = {
            tags: {id: {}, url: {}, base: []},
            options: {local: {include: new Set(), exclude: new Set(), id: {}}, global: {id: {}}},
            items: {url: {}, id: {}},
            getOptions(itemId: string) {
                const item = this.items.id[itemId];
                const options = this.options.local;

                const result = [];
                options.exclude.forEach(optionId => {
                    if (!item.option.includes(optionId)) {
                        result.push(optionId);
                    }
                })

                for (let optionId of item.option) {
                    if (options.include.has(optionId)) {
                        result.push(optionId);
                    }
                }

                return result;
            },
            getTotal(cart: Dict<ICartItem>) {
                const items = this.items.id;
                const options = this.options.local.id;
                return Price.total(Object.keys(cart).map(itemId => ({
                    item: items[itemId],
                    chunk: cart[itemId].chunk,
                    quantity: cart[itemId].quantity,
                    options: cart[itemId].optionIds.map(o => options[o])
                })));
            },
            getTagDeps(tagId: string) {
                const result = new Set([tagId]);
                const tags = this.tags.id;

                let stack = [...tags[tagId].children];

                while (stack.length > 0) {
                    const nodeId = stack.pop();
                    if (nodeId) {
                        result.add(nodeId);
                        const {children} = tags[nodeId]

                        for (let child of children) {
                            if (!result.has(child)) {
                                stack.push(child);
                            }
                        }
                    }

                }

                return Array.from(result);
            }
        }
    }

    for (let option of OptionAll) {
        let {game: {id: gameId}, area, id, active, merge} = option;
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

    for (let item of ItemAll) {
        let {game: {id: gameId}, id, active, url} = item;
        item.range = SafeJSON.parse(item.range, [])

        item.tag = item.tag.map((c: any) => c.id);
        item.item = item.item.map((c: any) => c.id);
        item.option = item.option.map((c: any) => c.id);
        if (active && gameId in shopDict.data) {
            shopDict.data[gameId].items.url[url] = id;
            shopDict.data[gameId].items.id[id] = item;
        }
    }

    for (let tag of TagAll) {
        let {game: {id: gameId}, id, active, name} = tag;

        tag.children = tag.children.map((c: any) => c.id);
        if (active && gameId in shopDict.data) {
            shopDict.data[gameId].tags.id[id] = tag;
            shopDict.data[gameId].tags.url[name] = id;
        }
    }

    for (let game of GameAll) {
        let {id: gameId} = game;
        const store = shopDict.data[gameId].tags;

        const tagBaseArray = Object.keys(store.id);
        const tagBaseCandidates = new Set(tagBaseArray);

        for (let tag of tagBaseArray) {
            const children = shopDict.data[gameId].getTagDeps(tag);
            for (let child of children) {
                if (child !== tag) {
                    tagBaseCandidates.delete(child);
                }
            }
        }

        store.base = Array.from(tagBaseCandidates);
    }

    return ({
        shop: shopDict,
        game: gameDict,
    })
}