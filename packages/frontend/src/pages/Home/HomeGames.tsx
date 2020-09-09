import React from 'react';
import {Typography, Paper, ButtonBase} from '@material-ui/core';
import {dictSort, IGame} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Link} from 'react-router-dom';
import {RowSwipable, Col} from 'pages/Base/Grid';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

export const HomeGames: React.FC = () => {
    const {games, current: {game}} = useStore();

    const current = game;
    const gamesSorted = dictSort(games.id);

    if (gamesSorted.length === 0 || !current) {
        return null;
    }

    const image = (game: IGame) => `${backend.uri}/${game.id}/${game.assistant}/u.png`;

    return (
        <Paper elevation={6}>
            <RowSwipable id="supported-games" s={16} p={16} w={150} arrows>
                {gamesSorted.map((game) => (
                    <ButtonBase component={Link} to={'/' + games.id[game].url}
                        style={{textDecoration: 'none', outline: "none"}}
                        key={game}
                    >
                        <Col key={game}>
                            <SafeImage
                                height={"inherit"}
                                src={image(games.id[game])} style={{
                                    minWidth: 80,
                                    width: 80, height: 80, objectFit: "cover", margin: 8, marginLeft: 0,
                                }} />
                            <Typography style={{textAlign: 'center'}}>
                                {`${games.id[game].name}`}
                            </Typography>
                        </Col>
                    </ButtonBase>
                ))}
            </RowSwipable>
        </Paper>
    );
};