import * as React from 'react';
import {Card, ButtonBase} from '@material-ui/core';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {CSSProperties, useContext} from 'react';
import {DataContext} from 'pages/Data/Wrapper';

interface IProps {
    style?: CSSProperties
}

export const Twitter: React.FC<IProps> = ({style = {}}) => {
    const {current: {game}} = useContext(DataContext);
    const current = game!;

    return (
        <Card style={{
            ...style,
        }}>
            <TwitterTimelineEmbed
                style={{marginRight: -18}}
                noHeader
                noBoarders
                sourceType="profile"
                screenName={current.twitter}
                options={{height: 420, marginRight: -18}}/>
        </Card>
    )
}
