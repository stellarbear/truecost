import React, {createContext, useState} from "react";
import {useQuery} from "react-apollo";
import gql from "graphql-tag";
import {arrayToDict, dictSort} from "auxiliary/sort";
import {RouteComponentProps, useHistory, withRouter} from "react-router";
import {OptionType, OptionArea} from "@truecost/shared";
import {useData, IStoreContext, IShop} from "./useData";
import {IGame, IUser} from "./interfaces";
import {useGame} from "./useGame";
import {useUser} from "./useUser";

export interface IDataContext extends IStoreContext {
    current: {
        user: IUser | null
        game: IGame | null,
        shop(): IShop | null
    }
    update: {
        setUser(user: IUser | null): void,
        setGame(id: string): void
    }
}

const DataContext = createContext<IDataContext>({} as IDataContext);

type DataProps = RouteComponentProps;

const Data: React.FC<DataProps> = ({children}) => {
    const {state: store, loading} = useData();
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, setState: setGame} = useGame(store.game);

    if (loading || !store) {
        return <span>Loading</span>;
    }


    return (
        <DataContext.Provider value={{
            store,
            current: {
                user: user,
                game: game,
                shop: () => game ? store.shop.data[game.id] : null
            },
            update: {
                setUser: (user: IUser | null) => setUser(user),
                setGame: (id: string) => {id in store.game.data.id && setGame(store.game.data.id[id])}
            }
        }}>
            <React.Fragment>
                {children}
            </React.Fragment>
        </DataContext.Provider>
    );
};

const DataWrapper = withRouter(Data)

export {DataWrapper, DataContext};
