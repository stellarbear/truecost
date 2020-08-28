import * as React from 'react';
import {gql, useQuery} from '@apollo/client';
import {useStore} from 'pages/Data/Wrapper';
import {CircularProgress, Paper, Typography} from '@material-ui/core';
import {IInfo, SafeJSON} from '@truecost/shared';
import {Carousel} from 'components/Carousel';
import {backend} from 'auxiliary/route';
import {SafeImage} from 'components/SafeImage';
import {Row} from 'pages/Base/Grid';
import {useHistory} from 'react-router';

const GET_INFO = gql`
    query InfoAll {
        InfoAll {
            id
            name
            order
            active

            text
            redirect
            images

            tag  { id }
            item  { id }
            game  { id }
        }
    }
`;

const height = 250;

const image = (infoId: string, imageId: string) => `${backend.uri}/${infoId}/${imageId}/u.jpg`;

const mock = () => (
    <Paper elevation={6} style={{overflow: "hidden", height}}>
        <Row s={8} p={8}>
            <CircularProgress size={24}/>
            <Typography>Fetching some data...</Typography>
        </Row>
    </Paper>
);

export const HomeInfo = () => {
    const history = useHistory();
    const {current: {game}} = useStore();
    const {data, loading, error} = useQuery(GET_INFO, {variables: {game: game.id}});

    if (loading || !data.InfoAll || data.InfoAll.length === 0 || error) {
        return mock();
    }

    const validInfo: IInfo[] = data.InfoAll.filter((d: IInfo) =>
        d.active && (d.game === null || d.game.id === game.id) && d.images.length === 1);

    if (validInfo.length === 0) {
        return mock();
    }

    return (
        <Paper elevation={6} style={{overflow: "hidden"}}>
            <Carousel>
                {validInfo.map(info => (
                    <div key={info.id} style={{position: "relative", cursor: "pointer"}}
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

                                 history.push(`${game.url}/${to}`);
                             } else {
                                 history.push(`${to}`);
                             }
                         }}
                    >
                        <SafeImage
                            style={{height, objectFit: "cover", width: "100%"}}
                            draggable="false"
                            src={image(info.id, info.images[0])}/>
                        <Row style={{position: "absolute", top: 0, left: 0}} p={16}>
                            <Typography style={{color: "white"}}>{info.text}</Typography>
                        </Row>
                    </div>
                ))}
            </Carousel>
        </Paper>
    );
};
