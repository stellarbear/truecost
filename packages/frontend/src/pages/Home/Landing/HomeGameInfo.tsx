import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {ButtonBase, Paper} from '@material-ui/core';
import {IGame, IInfo, SafeJSON} from '@truecost/shared';
import {Carousel} from 'components/Carousel';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import {Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';
import Markdown from 'components/Markdown';

const height = 250;

const image = (infoId: string, imageId: string) => `${backend.uri}/${infoId}/${imageId}/u.jpg`;

interface IProps {
    game: IGame;
}

export const HomeGameInfo: React.FC<IProps> = (props) => {
    const {game} = props;
    const history = useHistory();
    const {infos, update: {setGame}} = useStore();

    const validInfo: IInfo[] = (infos || []).filter((d: IInfo) =>
        d.active && (d.game === null || d.game.id === game.id) && d.images.length === 1);

    if (validInfo.length === 0) {
        return null;
    }

    return (
        <Paper elevation={6} style={{overflow: "hidden"}}>
            <Carousel>
                {validInfo.map(info => (
                    <ButtonBase key={info.id} style={{position: "relative"}}
                        onClick={() => {
                            if (info.redirect.length === 0) {
                                return;
                            }

                            const to = info.redirect[0] === "/" ? info.redirect.slice(1) : info.redirect;
                            if (info.game) {
                                const key = 'shop';
                                const oldValue = SafeJSON.parse(localStorage.getItem(key), {});
                                const newValue = {
                                    ...oldValue,
                                    tags: info.tag.map((t: any) => t.id),
                                    names: info.item.map((i: any) => i.id),
                                };
                                localStorage.setItem(key, JSON.stringify(newValue));
                                setGame(game.id);

                                history.push(`${game.url}/${to}`);
                            } else {
                                history.push(`${to}`);
                            }
                        }}
                    >
                        <SafeImage
                            alt={info.text}
                            style={{height, objectFit: "cover", width: "100%"}}
                            draggable="false"
                            src={image(info.id, info.images[0])} />
                        <Row style={{position: "absolute", top: 0, left: 0}} p={16}>
                            <Markdown style={{color: "white"}}>
                                {info.text}
                            </Markdown>
                        </Row>
                    </ButtonBase>
                ))}
            </Carousel>
        </Paper>
    );
};
