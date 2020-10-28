import {ButtonBase, Typography} from '@material-ui/core';
import {Dict, dictSort, IGame} from '@truecost/shared';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import {Col, RowSwipable} from 'pages/Base/Grid';
import {useStore} from 'pages/Data/Wrapper';
import React from 'react';
import {Link} from 'react-router-dom';

interface IProps {
    games: Dict<IGame>;
}

const hardcodedWidth = 1232;

export const HomeGameSelector: React.FC<IProps> = (props) => {
    const {games} = props;
    const {update: {setGame}} = useStore();
    const gamesSorted = dictSort(games);

    const image = (game: IGame) =>
        `${backend.uri}/${game.id}/${game.preview?.[0]}/u.png`;

    return (
        <RowSwipable id="services"
            s={16} w={Math.max(
                150,
                (hardcodedWidth - 16 * (gamesSorted.length - 1))
                / gamesSorted.length)
            }
            collapse
            arrows>
            {gamesSorted.map(gameId => (
                <ButtonBase
                    key={gameId}
                    component={Link}
                    to={'/' + games[gameId].url}
                    onClick={() => setGame(gameId)}
                >
                    <Col align="center">
                        <SafeImage
                            alt={`${games[gameId].name} service`}
                            height={"inherit"}
                            src={image(games[gameId])} style={{
                                objectFit: "cover", marginBottom: 8,
                            }} />
                        <Typography>
                            {games[gameId].name}
                        </Typography>
                    </Col>
                </ButtonBase>
            ))}
        </RowSwipable>
    );
};