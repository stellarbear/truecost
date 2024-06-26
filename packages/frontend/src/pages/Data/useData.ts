import {IGameContext, IInfo, IShopContext, ITagContext, IUser, parseShop} from '@truecost/shared';
import {mock} from './defaults';

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
    tag: ITagContext;
}

export interface IStoreContext {
    store: IStore;
}


export function useData(data: any): IStore {
    const {GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll, UserWhoAmI, InfoAll} = data;

    const {shop, game, tag} = parseShop(
        GameAll, ItemAll, TagAll, OptionAll, SubscriptionAll,
    );

    shop.data.truecost = mock.defaultShop;

    return ({
        user: {data: UserWhoAmI},
        info: {data: InfoAll},
        shop,
        game,
        tag,
    });
}
