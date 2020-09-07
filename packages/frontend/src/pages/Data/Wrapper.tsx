import React, {createContext, useContext, useState} from "react";
import {Dict, ICart, IGame, IGameContext, IShop, ISubscription, IUser, subscription} from "@truecost/shared";
import {useData, IInfoContext} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";
import {BULK_QUERY} from "./query";
import {ICartRemove, ICartUpsert, useCart} from "./useCart";
import {Mock} from "./Mock";
import {IMeta, useMeta} from "./useMeta";
import {useQuery} from "@apollo/client";

interface IRawContext {
    data: any;
}

export interface IDataContext {
    meta: Dict<IMeta>;
    games: IGameContext["data"];
    infos: IInfoContext["data"];
    subs: Dict<ISubscription>;
    current: {
        discount: number;
        user: IUser | null;
        game: IGame;
        shop(): IShop;
        cart(): ICart;
    };
    update: {
        setUser(user: IUser | null): void;
        setGame(id: string): void;
        cart: {
            upsert(data: ICartUpsert): void;
            remove(data: ICartRemove): void;
            count(data: ICartRemove): number;
            total(): number;
            wipe(): void;
        };
    };
    payment: {
        stripe: string;
    };
}

const RawContext = createContext<IRawContext>({} as IRawContext);
const DataContext = createContext<IDataContext>({} as IDataContext);


const Raw: React.FC = ({children}) => {
    console.log('query start');
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true});

    if (loading || !data || error) {
        return <Mock permanent/>;
    }

    return (
        <>
            <RawContext.Provider value={{data}}>
                <Data>
                    {children}
                </Data>
            </RawContext.Provider>
        </>
    );
};

const Data: React.FC = ({children}) => {
    const {data} = useContext(RawContext);
    const {MetaAll, Stripe, ...RestAll} = data;
    
    const [store] = useState(useData(RestAll));
    const [meta] = useState(useMeta(MetaAll));

    const {cart, itemUpsert, itemRemove, cartWipe, cartCount, itemCount} = useCart(store.shop);
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, setState: setGame} = useGame(store.game);

    return (
        <DataContext.Provider value={{
            meta,
            subs: store.shop.subs,
            games: store.game.data,
            infos: store.info.data,
            current: {
                discount: subscription.validate(user),
                user: user,
                game: game,
                cart: () => cart[game.id],
                shop: () => store.shop.data[game.id],
            },
            update: {
                setUser: (user: IUser | null) => setUser(user),
                setGame: (id: string) => {
                    id in store.game.data.id && setGame(store.game.data.id[id]);
                },
                cart: {
                    upsert: (data) => itemUpsert(game.id, data),
                    remove: (data) => itemRemove(game.id, data),
                    count: (data) => itemCount(game.id, data),
                    total: () => cartCount(game.id),
                    wipe: () => cartWipe(game.id),
                },
            },
            payment: {stripe: Stripe},
        }}>
            <Mock/>
            {children}
        </DataContext.Provider>
    );
};

const DataWrapper = Raw;
export const useStore = () => useContext(DataContext);

export {DataWrapper, DataContext};
