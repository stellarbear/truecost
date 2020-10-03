import {IGameContext, IInfo, IShopContext, IUser, parseShop} from '@truecost/shared';

export interface IUserContext {
    data?: IUser;
}

export interface IInfoContext {
    data?: IInfo[];
}

export interface IStore {
    user: IUserContext;
    info: IInfoContext;
    shop: IShopContext;
    game: IGameContext;
}

export interface IStoreContext {
    store: IStore;
}

export function useData(data: any): IStore {
    const {GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll, UserWhoAmI, InfoAll} = data;

    const {shop, game} = parseShop(
        GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll,
    );

    return ({
        user: {data: UserWhoAmI},
        info: {data: InfoAll},
        shop,
        game,
    });
}
