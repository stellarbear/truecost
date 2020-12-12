import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Link, useParams} from "react-router-dom";
import {Button} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Meta} from 'pages/Base/Meta';

export const CheckoutPaypal: React.FC = () => {
    const {token} = useParams<{token: string; PayerID: string}>();
    const {current: {game}} = useStore();

    return (
        <>
            <InfoCard
                text={[
                    "The purchase is in progress",
                    "Do NOT close this tab!",
                    " ",
                    "Note: you will be redirected automatically",
                ]}/>
        </>
    );
};
