import React, {useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {dictSort} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Link, useLocation} from 'react-router-dom';
import {Row} from 'pages/Base/Grid';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

export const GamePicker: React.FC = () => {
    const {pathname} = useLocation();
    const {games, current: {game}, update: {setGame}} = useStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const current = game;
    const gamesSorted = dictSort(games.id);

    if (pathname === "/" || gamesSorted.length === 0 || !current) {
        return null;
    }

    return (
        <>
            <Button color="inherit" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Row align="center">
                    <Typography variant="h6" style={{whiteSpace: "nowrap"}}>
                        {games.id[current.id].name}
                    </Typography>
                    <ArrowDropDown/>
                </Row>
            </Button>
            <Menu
                anchorEl={anchorEl}
                disableScrollLock
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
                                setAnchorEl(null);
                                setGame(game);
                            }}>{games.id[game].name}</MenuItem>
                    </Link>
                ))}
            </Menu>
        </>
    );
};
