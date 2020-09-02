import * as React from 'react';
import {Paper} from '@material-ui/core';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {useStore} from 'pages/Data/Wrapper';

const height = 250 - 4;

export const HomeTwitter: React.FC = () => {
    const {current: {game}} = useStore();

    return (
        <Paper elevation={6} style={{
            height: "100%",
        }}>
            <TwitterTimelineEmbed
                key={game.twitter}
                noHeader
                noBoarders
                sourceType="profile"
                screenName={game.twitter}
                options={{height}}
            />
        </Paper>
    );
};
