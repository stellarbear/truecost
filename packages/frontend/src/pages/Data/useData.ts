import {IUser, parseShop, IGameContext, IShopContext} from '@truecost/shared';

export interface IUserContext {
    data?: IUser;
}

export interface IStore {
    user: IUserContext;
    shop: IShopContext;
    game: IGameContext;
}

export interface IStoreContext {
    store: IStore;
}

export function useData(data: any): IStore {
    const {GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll, UserWhoAmI} = data;

    const {shop, game} = parseShop(
        GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll
    );

    return ({
        user: {data: UserWhoAmI},
        shop,
        game,
    })
}
