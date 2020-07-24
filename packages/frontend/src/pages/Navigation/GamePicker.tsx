import React, {createContext, useContext, useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {dictSort} from 'auxiliary/sort';
import {useHistory} from 'react-router';
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Link} from 'react-router-dom';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);

export const GamePicker: React.FC = () => {
    const history = useHistory();
    const {location: {pathname}} = history;
    const {store: {game: {data}}, current: {game}, update: {setGame}} = useStore()
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
    const path = (pathname + "/");
    const index = path.indexOf('/', 1);
    const gameUrl = path.slice(1, index);
    const valid = Object.keys(data.id).map(key => data.id[key].url);

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
                    <Link to={valid.includes(gameUrl) ? ('/' + data.id[game].url + path.slice(index, -1)) : path.slice(0, -1)}
                        style={{textDecoration: 'none', outline: "none"}}
                        key={game}
                    >
                        <MenuItem
                            value={game}
                            style={{color: "black"}}
                            onClick={() => setGame(game)}>{data.id[game].name}</MenuItem>
                    </Link>
                ))}
            </Menu>
        </div>
    );
};
