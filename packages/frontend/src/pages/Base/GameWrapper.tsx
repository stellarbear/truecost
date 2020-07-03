import React, {createContext} from "react";
import {games} from "auxiliary/route";
import {RouteComponentProps, withRouter} from "react-router-dom";

export interface IGameContext {
    game: string | null;
    changeGame: (game: string) => void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);


type GameProps = RouteComponentProps;

const keys = games.map(g => g.key);
const Game: React.FC<GameProps> = ({children, history, staticContext}) => {
    const url = (staticContext as any)?.url ?? '/';
    const gameKey = url.slice(0, url.indexOf('/'));
    const defaultGame = keys.includes(gameKey) ? gameKey : 'd2';

    const [game, setGame] = React.useState<string | null>(defaultGame);

    const changeGame = (game: string) => {

    };

    return (
        <GameContext.Provider value={{
            game,
            changeGame,
        }}>
            <React.Fragment>
                {children}
            </React.Fragment>
        </GameContext.Provider>
    );
};

const GameWrapper = withRouter(Game);

export {GameWrapper, GameContext};
