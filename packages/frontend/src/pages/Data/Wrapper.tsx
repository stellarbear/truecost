import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery} from "react-apollo";
import {OptionType, OptionArea, IUser, IGame, IOption, IShop, ICart, subscription, ISubscription, Dict, IGameContext} from "@truecost/shared";
import {useData, IStoreContext, IStore} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";
import {BULK_QUERY} from "./query";
import {ICartContext, useCart, ICartUpsert, ICartRemove} from "./useCart";
import {useHistory} from "react-router";
import {hydrate} from "react-dom";

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

const Mock: React.FC = () => {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        !hydrated && setHydrated(true);
    }, [])

    return (
        <div style={{
            transition: "all 0.5s",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: hydrated ? -9000 : 9000,
            opacity: hydrated ? 0.0 : 1.0,
            backgroundColor: "#fff",
        }}>
            <img
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
                width={16} height={16}
                src={`/preloader.gif`} />
        </div>
    )
}

const Raw: React.FC = ({children}) => {
    const {location: {pathname: url}} = useHistory();
    console.log('query start')
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true, variables: {url}});
    if (loading || !data) {
        return <Mock />
    }

    console.log(data.MetaCurrent);
    const [store] = useState(useData(data));
    return (
        <RawContext.Provider value={{
            payment: {stripe: data.Stripe},
            store,
        }}>
            <Mock />
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
    const {state: game, setState: setGame} = useGame(store.game);

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
