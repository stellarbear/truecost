import * as React from 'react';
import {Link} from "react-router-dom";
import {Button, Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';

export const CheckoutEmpty: React.FC = () => {
    const {current: {game}} = useStore();
    const url = '/' + game.url;

    return (
        <Row between p={[0, 16]}>
            <Col left>
                <Typography variant="body2">It seems that your cart is empty</Typography>
                <Typography variant="body2">Do not forget to add some goods!</Typography>
            </Col>
            <Button variant="outlined" component={Link} to={url + '/shop'} style={{textAlign: "center"}}>
                To the shop!
                </Button>,
        </Row>
    );
};
