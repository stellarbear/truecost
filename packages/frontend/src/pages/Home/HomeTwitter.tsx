import * as React from 'react';
import {Card, ButtonBase} from '@material-ui/core';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {CSSProperties, useContext} from 'react';
import {DataContext} from 'pages/Data/Wrapper';

interface IProps {
    style?: CSSProperties
}

export const HomeTwitter: React.FC<IProps> = ({style = {}}) => {
    const {current: {game}} = useContext(DataContext);
    const current = game!;

    return (
        <Card style={{
            height: "100%",
            ...style,
        }}>
            <TwitterTimelineEmbed
                noHeader
                noBoarders
                sourceType="profile"
                screenName={current.twitter}
                options={{height: 350}}
                />
        </Card>
    )
}
