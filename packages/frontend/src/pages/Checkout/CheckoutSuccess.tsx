import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Link, useParams} from "react-router-dom";
import {Button, IconButton} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {Meta} from 'pages/Base/Meta';
import {Col, Row} from "pages/Base/Grid";
import SocialDialog from "pages/Base/SocialDialog";
import {contact} from "auxiliary/social";
import {Alert} from '@material-ui/lab';

interface IParams {
    code?: string;
}

declare let Tawk_API: any;

export const CheckoutSuccess: React.FC = () => {
    const {current: {game}, update: {cart: {wipe}}} = useStore();
    const {code} = useParams<IParams>();
    const url = '/' + game.url;

    React.useEffect(() => {
        wipe();
    }, []);

    return (
        <>
            <Meta />
            <InfoCard
                text={[
                    <div key="0">Your order has been paid successfully</div>,
                    <div key="1">Here is your tracking number: <b>{code}</b></div>,
                    <br key="2" />,
                    <div key="3">Text it to any messenger below</div>,
                    <div key="4">so we can have a chat with you</div>,
                ]} actions={[
                    <Col key="shop" s={8}>
                        <Row justify="space-evenly" wrap>
                            {
                                contact.map((item, index) => (
                                    <SocialDialog key={`social-${index}`} button={
                                        (
                                            <div
                                                style={{padding: "0.5rem"}}>
                                                <Alert icon={false} variant="filled" severity="info">
                                                    <IconButton
                                                        aria-label={item.title}
                                                        style={{margin: "-0.5rem"}}
                                                        color="inherit" size="small">
                                                        {React.cloneElement(item.icon)}
                                                    </IconButton>
                                                </Alert>
                                            </div>
                                        )
                                    } {...item} />
                                ))
                            }
                        </Row>

                        <Button
                            variant="outlined" color="primary"
                            onClick={() => Tawk_API?.maximize()}>
                            send us a message via live chat
                        </Button>
                    </Col>,
                ]}
            />
        </>
    );
};
