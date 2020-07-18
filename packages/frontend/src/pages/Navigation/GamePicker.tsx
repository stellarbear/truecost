import React, {createContext, useContext, useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {dictSort} from 'auxiliary/sort';
import {useHistory} from 'react-router';
import {DataContext} from 'pages/Data/Wrapper';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);

interface GamePickerProps {
}

const GamePicker: React.FC<GamePickerProps> = () => {
    const history = useHistory();
    const {location: {pathname}} = history;
    const {store: {game: {data}}, current: {game}, update: {setGame}} = useContext(DataContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const current = game;
    const games = dictSort(data.id);

    if (games.length === 0 || !current) {
        return null;
    }

    //  TODO: change url

    return (
        <div style={{display: 'flex'}}>
            <Button color="inherit" aria-controls="GamePicker-nav" aria-haspopup="true" onClick={handleClick}>
                <div style={{display: 'flex'}}>
                    <Typography style={{whiteSpace: "nowrap"}}>
                        {data.id[current.id].name}
                    </Typography>
                    <ArrowDropDown />
                </div>
            </Button>
            <Menu
                id="GamePicker-nav"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {games.map((game) => (
                    <MenuItem
                        onClick={() => {
                            const gameIndex = pathname.indexOf('/', 1);
                            const gameUrl = gameIndex === -1
                                ? pathname.slice(1)
                                : pathname.slice(1, gameIndex);

                            const valid = Object.keys(data.id).map(key => data.id[key].url);
                            const to = valid.includes(gameUrl) ? '/' + data.id[game].url + pathname.slice(gameIndex) : pathname;

                            setGame(game);
                            history.push(to);
                        }}
                        value={game}
                        color="inherit"
                        key={game}>
                        {data.id[game].name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default GamePicker;
