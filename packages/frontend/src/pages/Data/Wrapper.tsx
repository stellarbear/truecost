import React, {createContext, useContext, useState} from "react";
import {
    CurrencyKey, Dict, ICart, ICurrency, IGame, IGameContext, IShop,
    ISubscription, IUser, subscription, ITagContext,
} from "@truecost/shared";
import {useData, IInfoContext} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";
import {BULK_QUERY} from "./query";
import {ICartRemove, ICartUpsert, useCart} from "./useCart";
import {Mock} from './Mock';
import {IMeta, useMeta} from "./useMeta";
import {useQuery} from "@apollo/client";
import {IReview, useReview} from "./useReview";
import {useCurrency} from "./useCurrency";
import { useConfig } from "./useConfig";

interface IRawContext {
    data: any;
}

export interface IDataContext {
    meta: Dict<IMeta>;
    reviews: IReview[];
    currency: ICurrency;
    config: Dict<any>;
    games: IGameContext["data"];
    tags: ITagContext["data"];
    infos: IInfoContext["data"];
    subs: Dict<ISubscription>;
    current: {
        discount: number;
        user: IUser | null;
        game: IGame;
        shop(id?: string): IShop;
        cart(id?: string): ICart;
    };
    update: {
        setCurrency(key: CurrencyKey): void;
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
    console.log('QUERY STARTED', +new Date());
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true});
    console.log(loading, error);

    if (loading || !data || error) {
        return <Mock permanent />;
    }
    console.log('QUERY FINISHED', +new Date());

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
    const {MetaAll, ReviewAll, ConfigAll, Stripe, ...RestAll} = data;

    const [store] = useState(useData(RestAll));
    const [meta] = useState(useMeta(MetaAll));
    const [reviews] = useState(useReview(ReviewAll));
    const [config] = useState(useConfig(ConfigAll));

    const {cart, itemUpsert, itemRemove, cartWipe, cartCount, itemCount} = useCart(store.shop);
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, setState: setGame} = useGame(store.game);

    const {currency, setCurrency} = useCurrency();

    return (
        <DataContext.Provider value={{
            meta,
            reviews,
            currency,
            config,
            subs: store.shop.subs,
            games: store.game.data,
            tags: store.tag.data,
            infos: store.info.data,
            current: {
                discount: subscription.validate(user),
                user: user,
                game: game,
                cart: (id) => cart[id || game.id],
                shop: (id) => store.shop.data[id || game.id],
            },
            update: {
                setCurrency,
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
            <Mock />
            {children}
        </DataContext.Provider>
    );
};

const DataWrapper = Raw;
export const useStore = () => useContext(DataContext);

export {DataWrapper, DataContext};
