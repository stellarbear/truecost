import {OptionArea, ITag, IOption, IItem, IBlog, IUser, IGame, OptionMerge} from '@truecost/shared';
import {SafeJSON} from 'auxiliary/json';
import {ICartContext, defaultCart} from './cart';

export type Dict<T> = Record<string, T>;

export interface IShop {
    tags: {
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
    },
    cart: ICartContext
}


export interface IShopContext {
    data: Dict<IShop>
}

export interface IBlogContext {
    data: {
        id: Dict<IBlog>,
        url: Dict<string>
    }
}

export interface IUserContext {
    data?: IUser;
}

export interface IGameContext {
    data: {
        id: Dict<IGame>,
        url: Dict<string>,
    }
}

export interface IStore {
    user: IUserContext;
    shop: IShopContext;
    game: IGameContext;
    blog: IBlogContext;
}

export interface IStoreContext {
    store: IStore;
}

export function useData(data: any) {
    const {GameAll, ItemAll, TagAll, OptionAll, BlogAll, UserWhoAmI} = data;

    console.log('calculating');
    const gameDict: IGameContext = {data: {id: {}, url: {}}};
    for (let game of GameAll) {
        let {id: gameId, active, url} = game;
        if (active) {
            gameDict.data.id[gameId] = game;
            gameDict.data.url[url] = gameId;
        }
    }
    const blogDict: IBlogContext = {data: {id: {}, url: {}}};
    for (let blog of BlogAll) {
        let {id, active, url} = blog;
        if (active) {
            blogDict.data.id[id] = blog;
            blogDict.data.url[url] = id;
        }
    }

    const shopDict: IShopContext = {data: {}};
    for (let gameId in gameDict.data.id) {
        shopDict.data[gameId] = {
            tags: {id: {}, url: {}},
            options: {local: {include: new Set(), exclude: new Set(), id: {}}, global: {id: {}}},
            items: {url: {}, id: {}},
            cart: defaultCart(gameId)
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

        item.tag = item.tag.map((t: any) => t instanceof Object ? t.id : t);
        item.item = item.item.map((i: any) => i instanceof Object ? i.id : i);
        item.option = item.option.map((o: any) => o instanceof Object ? o.id : o);

        if (active && gameId in shopDict.data) {
            shopDict.data[gameId].items.url[url] = id;
            shopDict.data[gameId].items.id[id] = item;
        }
    }

    for (let tag of TagAll) {
        let {game: {id: gameId}, id, active, name} = tag;
        if (active && gameId in shopDict.data) {
            shopDict.data[gameId].tags.id[id] = tag;
            shopDict.data[gameId].tags.url[name] = id;
        }
    }

    return ({
        user: {data: UserWhoAmI},
        shop: shopDict,
        game: gameDict,
        blog: blogDict,
    })
}
