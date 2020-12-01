import {ICurrency, IGameContext, IInfo, IShopContext, IUser, parseShop} from '@truecost/shared';
import {mock} from './mock';

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


export function useData(data: any, currency: ICurrency): IStore {
    const {GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll, UserWhoAmI, InfoAll} = data;

    const {shop, game} = parseShop(
        GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll,
        currency,
    );

    shop.data.truecost = mock.defaultShop;

    return ({
        user: {data: UserWhoAmI},
        info: {data: InfoAll},
        shop,
        game,
    });
}
