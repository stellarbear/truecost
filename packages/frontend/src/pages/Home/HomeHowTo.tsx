import * as React from 'react';
import SportsEsports from '@material-ui/icons/SportsEsports';
import Loyalty from '@material-ui/icons/Loyalty';
import RateReview from '@material-ui/icons/RateReview';
import {Paper, Typography} from '@material-ui/core';
import Chat from 'mdi-material-ui/Chat';
import Star from 'mdi-material-ui/Star';
import {Col, RowSwipable} from 'pages/Base/Grid';

export const HomeHowTo: React.FC = () => {
    const data = [{
        icon: <SportsEsports fontSize="large"/>,
        text: "Choose the items or the service you need at the shop",
    }, {
        icon: <Loyalty fontSize="large"/>,
        text: "Select your discount plan at the checkout (optional)",
    }, {
        icon: <Chat fontSize="large"/>,
        text: "We set up a convenient interaction between you and your player",
    }, {
        icon: <Star fontSize="large"/>,
        text: "Get what you want!",
    }, {
        icon: <RateReview fontSize="large"/>,
        text: "Leave an honest review in order to support us!",
    }];

    return (
        <Paper elevation={6}>
            <RowSwipable id="how-to" s={16} p={16} w={250} arrows>
                {data.map(({icon, text}, i) => (
                    <Col key={i}>
                        {icon}
                        <Typography style={{textAlign: 'center'}}>
                            {`${i + 1}. ${text}`}
                        </Typography>
                    </Col>
                ))}
            </RowSwipable>
        </Paper>
    );
};
