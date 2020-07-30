import {useHistory} from "react-router";
import {useState, useEffect} from "react";
import {IGame, IGameContext} from "@truecost/shared";

const defaultGame: IGame = {
    id: "truecost",
    url: "",
    order: 0,
    metatag: "",
    name: "truecost",
    active: false,
    twitter: "truecost",
    background: [""],
    assistant: [""],
}

interface IProps extends IGameContext {
}

export function useGame(props: IProps) {
    const {location: {pathname}} = useHistory();

    const path = (pathname + "/");
    const index = path.indexOf('/', 1);
    const gameUrl = path.slice(1, index)

    const currentGame = gameUrl in props.data.url
        ? props.data.url[gameUrl]
        : Object.keys(props.data.id)[0] || null

    const [state, setState] = useState<IGame>(
        currentGame && currentGame in props.data.id
            ? props.data.id[currentGame]
            : defaultGame);

    return {state, setState};
}
