import * as React from 'react';
import {Link} from "react-router-dom";
import {Button, Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';

export const CheckoutEmpty: React.FC = () => {
    const {current: {game}} = useStore();
    const url = '/' + game.url;

    return (
        <Row justify="space-between" style={{paddingLeft: 8}}>
            <Col s={8}>
                <Typography variant="body2">Your cart is empty</Typography>
                <Typography variant="body2">Order some goods first!</Typography>
            </Col>
            <Button variant="contained" color="primary"
                component={Link} to={url} style={{textAlign: "center"}}>
                To the shop!
            </Button>,
        </Row>
    );
};
