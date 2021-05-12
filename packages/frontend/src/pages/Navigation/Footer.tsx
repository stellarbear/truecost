import * as React from "react";
import {Button, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import {Link, useLocation} from "react-router-dom";
import {social} from "auxiliary/social";
import SocialDialog from "../Base/SocialDialog";
import {Col, Row} from "pages/Base/Grid";
import {
    Bitcoin, GooglePay, ApplePay, PayPal, Visa,
    MasterCard, Discover, JCB, UnionPay, Amex, Diners,
} from "assets/cards";
import {useNotification} from "components/wrappers/NotifyWrapper";

const additional = [
    PayPal,
    Bitcoin,
];

const mobile = [
    ApplePay,
    GooglePay,
];

const payment = [
    Visa,
    MasterCard,
    Discover,
    JCB,
    UnionPay,
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
            <FooterMobilePayment />
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
                <Typography variant="body2" color="inherit" align="center">© TrueCost Inc 2020-2021</Typography>
                <Typography variant="body2" color="inherit" align="center">30 N Gould St Ste R Sheridan, WY 82801</Typography>
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
    </Grid>
);

const FooterAdditionalPayment: React.FC = () => {
    const {notify} = useNotification();
    return (
        <Row
            onClick={() => notify("Contact us for bitcoin payments")}
            justify="center" wrap
            style={{
                marginBottom: -10,
                backgroundColor: "#E0E0E0",
                overflow: "hidden",
                cursor: "pointer",
            }} >
            {additional.map((e, i) => React.createElement(e, {
                style: {
                    margin: "20px 32px 0px",
                    transform: "scale(3.0)",
                },
                key: i,
            }))}
        </Row>
    );
};

const FooterMobilePayment: React.FC = () => {
    return (
        <Row
            justify="center" wrap
            style={{
                marginBottom: -10,
                backgroundColor: "#E0E0E0",
            }} >
            {mobile.map((e, i) => React.createElement(e, {
                style: {
                    margin: "20px 20px 0px",
                    transform: "scale(2.6)",
                },
                key: i,
            }))}
        </Row>
    );
};

const FooterPayment: React.FC = () => (
    <Row
        justify="center"
        style={{backgroundColor: "#E0E0E0", overflow: "hidden"}} >
        {payment.map((e, i) => React.createElement(e, {
            style: {
                width: 30, marginLeft: 34, marginTop: 40, marginRight: -20,
                transform: "scale(3.0)",
            },
            key: i,
        }))}
    </Row>
);