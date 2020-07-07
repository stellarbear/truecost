import {IGameContext, IShop} from "./useData";
import {useHistory} from "react-router";
import {IGame} from "./interfaces";
import {useState, useEffect} from "react";

interface IProps extends IGameContext {}

export function useGame(props: IProps) {
    const {location: {pathname}} = useHistory();

    const gameIndex = pathname.indexOf('/', 1);
    const gameUrl = gameIndex === -1
        ? pathname.slice(1)
        : pathname.slice(1, gameIndex);

    const currentGame = gameUrl in props.data.url
        ? props.data.url[gameUrl]
        : Object.keys(props.data.id)[0] || null

    const [state, setState] = useState<IGame | null>(
        currentGame && currentGame in props.data.id
            ? props.data.id[currentGame]
            : null);
            
    return {state, setState};
}