import * as React from 'react';
import ArrowDown from '@material-ui/icons/ArrowDownward'
import {Card, ButtonBase, Typography, Button, IconButton} from '@material-ui/core';
import {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {DataContext} from 'pages/Data/Wrapper';
import {SportsEsports, Loyalty, RateReview} from '@material-ui/icons';
import {Chat, Star} from 'mdi-material-ui';
import Row from 'pages/Base/Row';

interface IProps {
    style?: CSSProperties
}

export const HowTo: React.FC<IProps> = ({style = {}}) => {
    const props = {
        
    }
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
            <Row id={"how-it-works"}>
                {data.map(({icon, text}, i) => (
                    <div key={`how-to-${i}`}>
                        <div style={{
                            width: 200,
                            margin: "0px 8px",
                            alignItems: "center",
                            display: 'flex', flexDirection: 'column',
                        }}>
                            {icon}
                            <Typography style={{textAlign: 'center'}}>
                                {`${i + 1}. ${text}`}
                            </Typography>
                        </div>
                    </div>
                ))}
            </Row>
        </Card>
    );
}