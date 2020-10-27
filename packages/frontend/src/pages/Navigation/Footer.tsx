import * as React from "react";
import {Button, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import {Link, useLocation} from "react-router-dom";
import {social} from "auxiliary/social";
import SocialDialog from "../Base/SocialDialog";
import {Col, Row} from "pages/Base/Grid";
import {Bitcoin, Paypal, Visa, MasterCard, Discover, JCB, Unionpay, Amex, Diners} from "assets/cards";
import {useNotification} from "components/wrappers/NotifyWrapper";

const additional = [
    Paypal,
    Bitcoin,
];

const payment = [
    Visa,
    MasterCard,
    Discover,
    JCB,
    Unionpay,
    Amex,
    Diners,
];

export const Footer: React.FC = () => {
    const location = useLocation();

    return (
        <Paper elevation={6} style={{
            margin: "16px 0px",
            zIndex: 3,
            color: "#fff",
            backgroundColor: "#263238",
        }}>
            {!location.pathname.includes("checkout") && <FooterAbout />}
            <FooterAdditionalPayment />
            <FooterPayment />
        </Paper>
    );
};



const FooterAbout: React.FC = () => (
    <Grid container alignItems="center" >
        <Grid item xs={12} sm={5} md={3}>
            <Col p={8}>
                <Button color="inherit" component={Link} to={"/about"}>About us</Button>
                <Button color="inherit" component={Link} to={"/policy"}>Privacy policy</Button>
                <Button color="inherit" component={Link} to={"/tos"}>Terms of Service</Button>
            </Col>
        </Grid>

        <Grid item xs={12} sm={1} md={3} />
        <Grid item xs={12} sm={6} md={6}>
            <Col s={8} p={8} style={{marginTop: 8}}>
                <Typography variant="body2" color="inherit" align="center">© Truecost 2019-2020</Typography>
                <Typography variant="body2" color="inherit" align="center">2885 Sanford
                        Ave SW #46305 Grandville, MI 49418</Typography>
                <Row justify="center" wrap>
                    {
                        social.map((item, index) => (
                            <SocialDialog key={`social-${index}`} button={
                                (
                                    <IconButton
                                        aria-label={item.title}
                                        color="inherit" size="small">
                                        {React.cloneElement(item.icon, {style: {color: "white"}})}
                                    </IconButton>
                                )
                            } {...item} />
                        ))
                    }
                </Row>
            </Col>
        </Grid>

        <Grid item xs={12} sm={12} md={1}>

        </Grid>
    </Grid>
);

const FooterAdditionalPayment: React.FC = () => {
    const {notify} = useNotification();
    return (
        <Row
            onClick={() => notify("Contact us for paypal/bitcoin payments")}
            justify="center" wrap
            style={{backgroundColor: "#E0E0E0", overflow: "hidden", cursor: "pointer"}} >
            {additional.map((e, i) => React.createElement(e, {
                style: {
                    margin: "24px 32px 0px",
                    transform: "scale(3.0)",
                },
                key: i,
            }))}
        </Row>
    );
};

const FooterPayment: React.FC = () => (
    <Row
        justify="center" wrap
        style={{backgroundColor: "#E0E0E0", overflow: "hidden"}} >
        {payment.map((e, i) => React.createElement(e, {
            style: {
                width: 40, marginLeft: 40, marginTop: 40, marginRight: -20,
                transform: "scale(3.0)",
            },
            key: i,
        }))}
    </Row>
);