import React, {createContext, useContext, useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {dictSort} from 'auxiliary/sort';
import {useHistory} from 'react-router';
import {DataContext} from 'pages/Base/DataWrapper';

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
    const {store: {game: {data, current, setCurrent}}} = useContext(DataContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const games = dictSort(data);

    if (games.length === 0 || !current) {
        return null;
    }

    return (
        <div style={{display: 'flex'}}>
            <Button color="inherit" aria-controls="GamePicker-nav" aria-haspopup="true" onClick={handleClick}>
                <div style={{display: 'flex'}}>
                    <Typography style={{whiteSpace: "nowrap"}}>
                        {data[current].name}
                    </Typography>
                    <ArrowDropDownIcon/>
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

                            const valid = Object.keys(data).map(key => data[key].url);
                            const to = valid.includes(gameUrl) ? '/' + data[game].url + pathname.slice(gameIndex) : pathname;

                            setCurrent(game);
                            history.push(to);
                        }}
                        value={game}
                        color="inherit"
                        key={game}
                        disabled={!data[game].active}>
                        {data[game].name}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default GamePicker;
