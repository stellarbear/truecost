import React, {createContext, useState} from "react";
import {useQuery} from "react-apollo";
import gql from "graphql-tag";
import {dictSort} from "auxiliary/sort";
import {RouteComponentProps, useHistory, withRouter} from "react-router";
import {OptionType, OptionArea, IUser, IGame} from "@truecost/shared";
import {useData, IStoreContext, IShop} from "./useData";
import {useGame} from "./useGame";
import {useUser} from "./useUser";

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

const DataContext = createContext<IDataContext>({} as IDataContext);

type DataProps = RouteComponentProps;

const Data: React.FC<DataProps> = ({children}) => {
    const {state: store, loading} = useData();
    const {state: user, setState: setUser} = useUser(store.user);
    const {state: game, setState: setGame} = useGame(store.game);

    if (loading || !store) {
        return <span>Loading</span>;
    }

    console.log(store);

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
            <React.Fragment>
                {children}
            </React.Fragment>
        </DataContext.Provider>
    );
};

const DataWrapper = withRouter(Data)

export {DataWrapper, DataContext};
