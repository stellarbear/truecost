import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery} from "react-apollo";
import gql from "graphql-tag";
import {dictSort} from "auxiliary/sort";
import {RouteComponentProps, useHistory, withRouter} from "react-router";
import {OptionType, OptionArea, IUser, IGame, IOption} from "@truecost/shared";
import {useData, IStoreContext, IShop, IStore} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";
import {BULK_QUERY} from "./query";
import {ICartContext, ICart, useCart, ICartUpsert, ICartRemove} from "./useCart";

interface IRawContext {
    store: IStore
}

export interface IDataContext extends IStoreContext {
    cart: ICartContext,
    current: {
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
            wipe(): void
        }
    }
}

const RawContext = createContext<IRawContext>({} as IRawContext);
const DataContext = createContext<IDataContext>({} as IDataContext);

const Raw: React.FC = ({children}) => {
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true});
    if (loading || !data) {
        return <span>Loading</span>;
    }

    const [store] = useState(useData(data));
    return (
        <RawContext.Provider value={{
            store,
        }}>
            <Data>
                {children}
            </Data>
        </RawContext.Provider>
    );
}

const Data: React.FC = ({children}) => {
    const {store} = useContext(RawContext);
    //debugger;

    const {cart, itemUpsert, itemRemove, cartWipe} = useCart(store.shop);
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, setState: setGame} = useGame(store.game);

    /*
    console.log('data,', store);
    console.log('user,', user);
    console.log('game,', game);
    */

    return (
        <DataContext.Provider value={{
            cart,
            store,
            current: {
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
                    wipe: () => cartWipe(game.id)
                }
            }
        }}>
            {children}
        </DataContext.Provider>
    );
};

const DataWrapper = Raw;
export const useStore = () => useContext(DataContext);

export {DataWrapper, DataContext};
