import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Link} from "react-router-dom";
import {Button} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';

export const CheckoutSuccess: React.FC = () => {
    const {current: {game, cart}, update: {cart: {wipe}}} = useStore();
    const url = '/' + game.url

    React.useEffect(() => {
        wipe();
    }, [])

    return (
        <InfoCard
            text={[
                "The purchase was successful!",
                "Further instructions are sent to your email.",
                " ",
                "Note: do not forget to check SPAM folder",
                "Note 2: if you are a new user, we have sent password to your email",
            ]} actions={[
                <Button variant="outlined" component={Link} to={url + '/shop'}>To the shop!</Button>,
            ]} />
    )
}