import React, {createContext, useState} from "react";
import {useQuery} from "react-apollo";
import gql from "graphql-tag";
import {arrayToDict, dictSort} from "auxiliary/sort";
import {RouteComponentProps, useHistory, withRouter} from "react-router";

export interface IBase {
    id: string;
    url: string;
    name: string;
    order: number;
    active: boolean;
}


export interface IMeta {
}

export interface IUser {
    role: string;
    email: string;
    name: string;
    id: string;
}

export interface IGame extends IBase {
    twitter: string;
    background: string[];
    assistant: string[];
}

export interface IBlog extends IBase {
    preview: string;
    images: string[];
    date: number;
}

export interface IBlog extends IBase {
    twitter: string;
    background: string[];
    assistant: string[];
}

const base = {
    fragment: `
		id
		url
		name
		order
		active
	`,
};
export const BULK_QUERY = gql`
    query DataAll  {
        UserWhoAmI {
            id
            name

            role
            email
        }
        GameAll {
            ${base.fragment}
            twitter
            background
            assistant
        }
        BlogAll {
            ${base.fragment}
            preview
            images
            date
        }
    }
`;
/*
TagAll {
	${base.fragment}
	game { id }
	item { id }
}
OptionAll {
	${base.fragment}
	price
	free
	type
	area
	filter
	game { id }
	item { id }
}
*/

type Dict<T> = Record<string, T>;

export interface IDataContext {
    store: {
        user: {
            data?: IUser;
            discardUser: () => void;
            updateUser: (user: any) => void;
        };
        game: {
            url: () => string;
            data: Dict<IGame>;
            current: string | null;
            setCurrent: (game: string) => void;
        };
        blog: {
            data: Dict<IBlog>;
        };
    };
}

const DataContext = createContext<IDataContext>({} as IDataContext);

type DataProps = RouteComponentProps;

const Data: React.FC<DataProps> = ({children, staticContext}): JSX.Element => {
    const {location: {pathname}} = useHistory();
    const [current, setCurrent] = useState<string | null>(null);

    const [user, setUser] = React.useState<IUser | undefined>();
    const updateUser = (user: any) => {
        //const { pass, total } = validateDiscount(user.passInfo);
        setUser({...user/* pass, total */});
    };
    //const { math: { validateDiscount } } = useContext(CartContext);
    const {data, error, loading} = useQuery(BULK_QUERY, {ssr: true, fetchPolicy: 'cache-first'});


    if (loading) {
        return <span>Loading</span>;
    }
    /*
        if (data?.GameAll.length == 0) {
            return <Redirect to="/404"/>
        }
    */
    const gamesUrls: Record<string, IGame> = arrayToDict(data?.GameAll, "url");
    const gamesDict: Record<string, IGame> = arrayToDict(data?.GameAll, "id");
    const gamesIds = dictSort(gamesDict);

    //const url = (staticContext as any)?.url ?? '/';
    const gameIndex = pathname.indexOf('/', 1);
    const gameUrl = gameIndex === -1
        ? pathname.slice(1)
        : pathname.slice(1, gameIndex);
    const currentGame = gameUrl in gamesUrls
        ? gamesUrls[gameUrl].id
        : gamesIds[0];

    if (data?.GameAll.length !== 0 && current == null && currentGame != null) {
        setCurrent(currentGame);
    }

    const blogDict = arrayToDict(data?.BlogAll);
    return (
        <DataContext.Provider value={{
            store: {
                user: {data: data?.UserWhoAmI, updateUser, discardUser: () => setUser(undefined)},
                game: {data: gamesDict, current, setCurrent, url: () => current ? '/' + gamesDict[current].url : ''},
                blog: {data: blogDict},
            },
        }}>
            <React.Fragment>
                {children}
            </React.Fragment>
        </DataContext.Provider>
    );
};

const DataWrapper = withRouter(Data);

export {DataWrapper, DataContext};
