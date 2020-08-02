import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Link} from "react-router-dom";
import {Button} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';

export const CheckoutEmpty: React.FC = () => {
    const {current: {game, cart}} = useStore();
    const url = '/' + game.url

    return (
        <InfoCard
            text={[
                "Oups! Your cart is empty!",
            ]} actions={[
                <Button variant="outlined" component={Link} to={url + '/shop'}>To the shop!</Button>,
            ]} />
    )
}