import * as React from 'react';
import ArrowDown from '@material-ui/icons/ArrowDownward'
import SportsEsports from '@material-ui/icons/SportsEsports';
import Loyalty from '@material-ui/icons/Loyalty';
import RateReview from '@material-ui/icons/RateReview';
import {Card, ButtonBase, Typography, Button, IconButton} from '@material-ui/core';
import {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {DataContext} from 'pages/Data/Wrapper';
import Chat from 'mdi-material-ui/Chat';
import Star from 'mdi-material-ui/Star';
import {RowSwipable, Col} from 'pages/Base/Grid';

interface IProps {
    style?: CSSProperties
}

export const HomeHowTo: React.FC<IProps> = ({style = {}}) => {
    const props = {}
    const data = [{
        icon: <SportsEsports fontSize="large" />,
        text: "Choose the items or the service you need at the shop",
    }, {
        icon: <Loyalty fontSize="large" />,
        text: "Select your discount plan at the checkout (optional)",
    }, {
        icon: <Chat fontSize="large" />,
        text: "We set up a convenient interaction between you and your player",
    }, {
        icon: <Star fontSize="large" />,
        text: "Get what you want!",
    }, {
        icon: <RateReview fontSize="large" />,
        text: "Leave an honest review in order to support us!",
    }];
    return (
        <Card style={style}>
            <RowSwipable s={16} p={16} w={250}>
                {data.map(({icon, text}, i) => (
                    <Col key={i}>
                        {icon}
                        <Typography style={{textAlign: 'center'}}>
                            {`${i + 1}. ${text}`}
                        </Typography>
                    </Col>
                ))}
            </RowSwipable>
        </Card>
    );
}
