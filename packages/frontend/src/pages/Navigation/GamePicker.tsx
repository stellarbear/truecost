import React, {createContext, useContext, useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {dictSort} from '@truecost/shared';
import {useHistory} from 'react-router';
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Link} from 'react-router-dom';
import {Row} from 'pages/Base/Grid';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

const GameContext = createContext<IGameContext>({} as IGameContext);

export const GamePicker: React.FC = () => {
    const history = useHistory();
    const {location: {pathname}} = history;
    const {games, current: {game}, update: {setGame}} = useStore()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const current = game;
    const gamesSorted = dictSort(games.id);

    if (gamesSorted.length === 0 || !current) {
        return null;
    }

    return (
        <>
            <Button color="inherit" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Row>
                    <Typography style={{whiteSpace: "nowrap"}}>
                        {games.id[current.id].name}
                    </Typography>
                    <ArrowDropDown />
                </Row>
            </Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {gamesSorted.map((game) => (
                    <Link to={'/' + games.id[game].url}
                        style={{textDecoration: 'none', outline: "none"}}
                        key={game}
                    >
                        <MenuItem
                            value={game}
                            style={{color: "black"}}
                            onClick={() => {
                                setAnchorEl(null)
                                setGame(game)
                            }}>{games.id[game].name}</MenuItem>
                    </Link>
                ))}
            </Menu>
        </>
    );
};
