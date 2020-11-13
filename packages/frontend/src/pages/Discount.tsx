import * as React from 'react';
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import {Button, Typography} from '@material-ui/core';
import AddCircle from '@material-ui/icons/AddCircle';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import Loyalty from '@material-ui/icons/Loyalty';
import {Col} from './Base/Grid';
import {useStore} from './Data/Wrapper';
import {Link} from 'react-router-dom';
import TextCard from './Base/TextCard';
import {Meta} from './Base/Meta';

export const Discount: React.FC = () => {
    const {subs, current: {game}} = useStore();
    const url = '/' + game.url;

    const mock = () => (
        <Typography variant="caption">Unfortunaltely, no plans available</Typography>
    );

    const ids = Object.keys(subs);

    return (
        <>
            <Meta />
            <TextCard title="Discount">
                <Col s={8}>
                    <Typography>
                        Discount plan is a simple way of having permanent discount on everything (every item and service
                        on every game) for relatively cheap one time payment.
                    </Typography>
                    <Typography><strong>Important:</strong> discount is applied only on the last (3rd step)</Typography>
                    <Typography><strong>How to purchuase a discount:</strong></Typography>
                    <TimelineItem>
                        <TimelineOppositeContent style={{maxWidth: 0}} />
                        <TimelineSeparator>
                            <TimelineDot>
                                <AddCircle />
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body2" color="textSecondary">
                                1 step
                            </Typography>
                            <Button variant="outlined" component={Link} to={url + '/shop'}>
                                Add items to cart
                            </Button>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent style={{maxWidth: 0}} />
                        <TimelineSeparator>
                            <TimelineDot color="primary">
                                <ShoppingCart />
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body2" color="textSecondary">
                                2 step
                            </Typography>
                            <Button variant="outlined" component={Link} to={url + '/checkout'}>
                                Verify your order
                            </Button>
                        </TimelineContent>
                    </TimelineItem>
                    <TimelineItem>
                        <TimelineOppositeContent style={{maxWidth: 0}} />
                        <TimelineSeparator>
                            <TimelineDot color="secondary">
                                <Loyalty />
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography variant="body2" color="textSecondary">
                                3 step
                            </Typography>
                            <Button variant="outlined" component={Link} to={url + '/checkout/2'}>
                                Select discount plan
                            </Button>
                        </TimelineContent>
                    </TimelineItem>
                    <Typography><strong>Сurrently available plans:</strong></Typography>
                    {ids.length > 0 ?
                        ids.map(subId => (
                            <Typography key={subId} style={{
                                userSelect: "none",
                            }}>{`• ${subs[subId].description}`}</Typography>
                        )) : mock()}
                </Col>
            </TextCard>
        </>
    );
};
