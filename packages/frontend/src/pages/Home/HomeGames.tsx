import React from 'react';
import {Typography, Paper, ButtonBase} from '@material-ui/core';
import {dictSort, IGame} from '@truecost/shared';
import {useStore} from 'pages/Data/Wrapper';
import {Link} from 'react-router-dom';
import {RowSwipable, Col, Row} from 'pages/Base/Grid';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import CheckCircle from '@material-ui/icons/CheckCircle';

export interface IGameContext {
    game?: string;
    changeGame: (game: string) => void;
}

const Overlay: React.FC = () => (
    <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#FFFFFFDD",
    }}>
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }}>
            <Col>
                <CheckCircle color="primary" style={{transform: "scale(1.5)"}} />
            </Col>
        </div>
    </div>
);

export const HomeGames: React.FC = () => {
    const {games, current: {game}, update: {setGame}} = useStore();

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
                    <Row style={{position: "relative"}}
                        key={game}>
                        <ButtonBase component={Link} to={'/' + games.id[game].url}
                            style={{textDecoration: 'none', outline: "none"}}
                            disabled={game === current.id}
                            onClick={() => setGame(game)}
                        >
                            <Col key={game}>
                                <SafeImage
                                    alt={`${games.id[game].name} icon`}
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
                        {(game === current.id) && (
                            <Overlay />
                        )}
                    </Row>
                ))}
            </RowSwipable>
        </Paper >
    );
};