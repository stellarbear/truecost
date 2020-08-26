import * as React from 'react';
import {Card, ButtonBase, Paper} from '@material-ui/core';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {CSSProperties, useContext} from 'react';
import {DataContext} from 'pages/Data/Wrapper';

const height = 250 - 4;

export const HomeTwitter: React.FC = () => {
    const {current: {game}} = useContext(DataContext);
    const current = game!;

    return (
        <Paper elevation={6} style={{
            height: "100%",
        }}>
            <TwitterTimelineEmbed
                noHeader
                noBoarders
                sourceType="profile"
                screenName={current.twitter}
                options={{height}}
            />
        </Paper>
    )
}
