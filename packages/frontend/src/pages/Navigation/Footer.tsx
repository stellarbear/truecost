import * as React from "react";
import {Button, Grid, IconButton, Paper, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {social} from "auxiliary/social";
import SocialDialog from "../Base/SocialDialog";
import {Col, Row} from "pages/Base/Grid";
import {Visa, MasterCard, Discover, JCB, Unionpay, Amex, Diners} from "assets/cards";

const payment = [
    Visa,
    MasterCard,
    Discover,
    JCB,
    Unionpay,
    Amex,
    Diners,
];

export const Footer: React.FC = () => (
    <Paper elevation={6} style={{
        marginBottom: 16,
        zIndex: 3,
        color: "#fff",
        backgroundColor: "#263238",
    }}>
        <Col fullWidth>
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
                    <Col fullWidth s={8} p={8} style={{marginTop: 8}}>
                        <Typography variant="body2" color="inherit" align="center">© Truecost 2019-2020</Typography>
                        <Typography variant="body2" color="inherit" align="center">2885 Sanford
                        Ave SW #46305 Grandville, MI 49418</Typography>
                        <Row wrap>
                            {
                                social.map((item, index) => (
                                    <SocialDialog key={`social-${index}`} button={
                                        (
                                            <IconButton color="inherit" size="small">
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
        </Col>
        <Col style={{backgroundColor: "#E0E0E0", overflow: "hidden"}}>
            <Row s={-32} style={{marginTop: 40, marginBottom: -8}} wrap>
                {payment.map((e, i) => React.createElement(e, {
                    style: {
                        width: 40, marginLeft: 40, padding: 8,
                        transform: "scale(3.0)",
                    },
                    key: i,
                }))}
            </Row>
        </Col>
    </Paper>
);
