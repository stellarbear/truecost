import {Typography} from '@material-ui/core';
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator, TimelineDot,
    TimelineConnector, TimelineContent,
} from '@material-ui/lab';
import React from 'react';
import {Col} from './Grid';

const data = [{
    text: "Choose the items or the service you need at the shop",
    help: "You can alse choose options at discounted prices",
}, {
    text: "Select your discount plan at the checkout (optional)",
    help: "The discount is puchuased for a month or a year",
}, {
    text: "We set up a convenient interaction between you and your player",
    help: "In your personal account, you can see the current progress",
}, {
    text: "Get what you want!",
}, {
    text: "Leave an honest review in order to support us!",
    help: "We always welcome your feedback",
}];

export const HowToUse: React.FC = () => (
    <Col>
        {data.map(({text, help}, i) => (
            <TimelineItem key={i}>
                <TimelineOppositeContent style={{maxWidth: 0, padding: 0}} />
                <TimelineSeparator>
                    <TimelineDot>
                        <Col justify="center" style={{width: 32, height: 32}}>
                            <Typography align="center">
                                {`${i + 1}`}
                            </Typography>
                        </Col>
                    </TimelineDot>
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant="h6" >
                        {text}
                    </Typography>
                    {help && (
                        <Typography variant="body2" >
                            {help}
                        </Typography>
                    )}
                </TimelineContent>
            </TimelineItem>
        ))}
    </Col >
);