import * as React from 'react';
import {useContext} from 'react';
import {Paper} from '@material-ui/core';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {DataContext} from 'pages/Data/Wrapper';

const height = 250 - 4;

export const HomeTwitter: React.FC = () => {
    const {current: {game}} = useContext(DataContext);

    return (
        <Paper elevation={6} style={{
            height: "100%",
        }}>
            <TwitterTimelineEmbed
                noHeader
                noBoarders
                sourceType="profile"
                screenName={game.twitter}
                options={{height}}
            />
        </Paper>
    );
};
