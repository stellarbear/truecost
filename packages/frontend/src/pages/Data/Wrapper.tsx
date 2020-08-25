import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery} from "react-apollo";
import {OptionType, OptionArea, IUser, IGame, IOption, IShop, ICart, subscription, ISubscription, Dict, IGameContext} from "@truecost/shared";
import {useData, IStoreContext, IStore} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";
import {BULK_QUERY} from "./query";
import {ICartContext, useCart, ICartUpsert, ICartRemove} from "./useCart";
import {useHistory} from "react-router";

interface IRawContext {
    store: IStore
    payment: {
        stripe: string
    }
}

export interface IDataContext {
    games: IGameContext["data"],
    subs: Dict<ISubscription>
    current: {
        discount: number
        user: IUser | null
        game: IGame,
        shop(): IShop,
        cart(): ICart
    }
    update: {
        setUser(user: IUser | null): void,
        setGame(id: string): void
        cart: {
            upsert(data: ICartUpsert): void,
            remove(data: ICartRemove): void,
            count(data: ICartRemove): number,
            total(): number
            wipe(): void
        }
    }
    payment: {
        stripe: string
    }
}

const RawContext = createContext<IRawContext>({} as IRawContext);
const DataContext = createContext<IDataContext>({} as IDataContext);

const Raw: React.FC = ({children}) => {
    const {location: {pathname: url}} = useHistory();
    console.log('query start')
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true, variables: {url}});
    if (loading || !data) {
        return <span>Loading</span>;
    }

    console.log(data.MetaCurrent);
    const [store] = useState(useData(data));
    return (
        <RawContext.Provider value={{
            payment: {stripe: data.Stripe},
            store,
        }}>
            <Data>
                {children}
            </Data>
        </RawContext.Provider>
    );
}

const Data: React.FC = ({children}) => {
    const {store, payment} = useContext(RawContext);

    const {cart, itemUpsert, itemRemove, cartWipe, cartCount, itemCount} = useCart(store.shop);
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, updateState: setGame} = useGame(store.game);

    return (
        <DataContext.Provider value={{
            //cart,
            //store,
            subs: store.shop.subs,
            games: store.game.data,
            current: {
                discount: subscription.validate(user),
                user: user,
                game: game,
                cart: () => cart[game.id],
                shop: () => store.shop.data[game.id]
            },
            update: {
                setUser: (user: IUser | null) => setUser(user),
                setGame: (id: string) => {
                    id in store.game.data.id && setGame(store.game.data.id[id])
                },
                cart: {
                    upsert: (data) => itemUpsert(game.id, data),
                    remove: (data) => itemRemove(game.id, data),
                    count: (data) => itemCount(game.id, data),
                    total: () => cartCount(game.id),
                    wipe: () => cartWipe(game.id),
                }
            },
            payment
        }}>
            {children}
        </DataContext.Provider>
    );
};

const DataWrapper = Raw;
export const useStore = () => useContext(DataContext);

export {DataWrapper, DataContext};
