import * as React from 'react';
import {Paper} from '@material-ui/core';
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import {useStore} from 'pages/Data/Wrapper';

const height = 250;

export const HomeTwitter: React.FC = () => {
    const {current: {game}} = useStore();

    return (
        <Paper elevation={6} style={{
            height,
            overflow: "hidden",
            position: "relative",
        }}>
            <div style={{
                    position: "absolute",
                    overflowY: "scroll",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: -18,
                    paddingRight: 18,
            }}>
                <TwitterTimelineEmbed
                    key={game.twitter}
                    noHeader
                    noBoarders
                    sourceType="profile"
                    screenName={game.twitter}
                    noScrollbar
                    noFooter
                    options={{tweetLimit: 4}}
                />
            </div>
        </Paper>
    );
};
