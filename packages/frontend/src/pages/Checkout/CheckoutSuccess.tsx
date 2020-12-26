import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Link} from "react-router-dom";
import {Button} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Meta} from 'pages/Base/Meta';

export const CheckoutSuccess: React.FC = () => {
    const {current: {game}, update: {cart: {wipe}}} = useStore();
    const url = '/' + game.url;

    React.useEffect(() => {
        wipe();
    }, []);

    return (
        <>
            <Meta />
            <InfoCard
                text={[
                    "The purchase was successful!",
                    "Further instructions are sent to your email.",
                    " ",
                    "Note: do not forget to check SPAM folder",
                ]} actions={[
                    <Button key="shop"
                        variant="outlined" color="primary"
                        component={Link} to={url + '/shop'}>To the shop!</Button>,
                ]} />
        </>
    );
};
