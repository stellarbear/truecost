import {useHistory} from "react-router";
import {useState} from "react";
import {IGame, IGameContext} from "@truecost/shared";
import {mock} from "./mock";

type IProps = IGameContext;

export function useGame(props: IProps) {
    const history = useHistory();
    const {location: {pathname}} = history;

    const path = (pathname + "/");
    const index = path.indexOf('/', 1);
    const gameUrl = path.slice(1, index);

    const currentGame = gameUrl in props.data.url
        ? props.data.url[gameUrl]
        : Object.keys(props.data.id)[0] || null;

    const [state, setState] = useState<IGame>(
        currentGame && currentGame in props.data.id
            ? props.data.id[currentGame]
            : mock.defaultGame);

    return {state, setState};
}
