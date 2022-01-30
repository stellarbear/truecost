import { useLocation } from "react-router";
import { useState } from "react";
import { IGame, IGameContext } from "@truecost/shared";
import { mock } from "./defaults";

type IProps = IGameContext;

export const extractGame = (pathname: string, games: IGameContext["data"]) => {
    const path = (pathname + "/");
    const index = path.indexOf('/', 1);
    const gameUrl = path.slice(1, index);

    const currentGame = gameUrl in games.url
        ? games.url[gameUrl]
        : Object.keys(games.id)[0];

    return currentGame;
};

export function useGame(props: IProps) {
    const { pathname } = useLocation();

    const currentGame = extractGame(pathname, props.data)
        ?? Object.keys(props.data.id)[0] ?? null;

    const [state, setState] = useState<IGame>(
        currentGame && currentGame in props.data.id
            ? props.data.id[currentGame]
            : mock.defaultGame);

    return { state: currentGame ? props.data.id[currentGame] : state, setState };
}
