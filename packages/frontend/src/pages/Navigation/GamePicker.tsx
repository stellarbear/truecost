import React, {useState} from 'react';
import {Button, Menu, MenuItem, Typography} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import SportsEsports from '@material-ui/icons/SportsEsports';
import {useStore} from 'pages/Data/Wrapper';
import {Link, useLocation} from 'react-router-dom';
import {Row} from 'pages/Base/Grid';
import {Circle} from 'components';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

interface IProps {
    mobile?: boolean;
}

export const GamePicker: React.FC<IProps> = (props) => {
    const {mobile = false} = props;
    const {pathname} = useLocation();
    const {games, current: {game}, update: {setGame}} = useStore();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const current = game;
    const ids = Object.keys(games.id);

    if (pathname === "/" || ids.length === 0 || !current) {
        return null;
    }

    return (
        <>
            <Button color="inherit" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Row align="center">
                    {mobile
                        ? (
                            <SportsEsports />
                        ) : (
                            <Typography variant="h6" style={{whiteSpace: "nowrap"}}>
                                {games.id[current.id].name}
                            </Typography>
                        )
                    }
                    <ArrowDropDown />
                </Row>
            </Button>
            <Menu
                anchorEl={anchorEl}
                disableScrollLock
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {ids.map((game) => (
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
                            }}>

                            <Row s={8} align="center">
                                <div>
                                    {games.id[game].name}
                                </div>
                                {(game === current.id) && <Circle />}
                            </Row>
                        </MenuItem>
                    </Link>
                ))}
            </Menu>
        </>
    );
};
