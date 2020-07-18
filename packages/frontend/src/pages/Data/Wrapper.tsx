import React, {createContext, useState, useEffect, useContext} from "react";
import {useQuery} from "react-apollo";
import gql from "graphql-tag";
import {dictSort} from "auxiliary/sort";
import {RouteComponentProps, useHistory, withRouter} from "react-router";
import {OptionType, OptionArea, IUser, IGame} from "@truecost/shared";
import {useData, IStoreContext, IShop} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";
import {BULK_QUERY} from "./query";

interface IRawContext {
    raw: any
}

export interface IDataContext extends IStoreContext {
    current: {
        user: IUser | null
        game: IGame,
        shop(): IShop
    }
    update: {
        setUser(user: IUser | null): void,
        setGame(id: string): void
    }
}

const RawContext = createContext<IRawContext>({} as IRawContext);
const DataContext = createContext<IDataContext>({} as IDataContext);

const Raw: React.FC = ({children}) => {
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true});
    
    if (loading) {
        return <span>Loading</span>;
    }

    return (
        <RawContext.Provider value={{
            raw: data,
        }}>
            <Data>
                {children}
            </Data>
        </RawContext.Provider>
    );
}

const Data: React.FC = ({children}) => {
    const {raw} = useContext(RawContext);
    const [store] = useState(useData(raw));
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, setState: setGame} = useGame(store.game);

    return (
        <DataContext.Provider value={{
            store,
            current: {
                user: user,
                game: game,
                shop: () => store.shop.data[game.id]
            },
            update: {
                setUser: (user: IUser | null) => setUser(user),
                setGame: (id: string) => {id in store.game.data.id && setGame(store.game.data.id[id])}
            }
        }}>
            {children}
        </DataContext.Provider>
    );
};

const DataWrapper = Raw;

export {DataWrapper, DataContext};
