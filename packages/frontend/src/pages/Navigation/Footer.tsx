import * as React from "react";
import {Button, createStyles, Divider, IconButton, makeStyles, Theme, Typography, Paper, Grid} from "@material-ui/core";
import {Link} from "react-router-dom";
import {social} from "auxiliary/social";
import SocialDialog from "../Base/SocialDialog";
import {Row, Col} from "pages/Base/Grid";

export const Footer: React.FC = () => (
    <Paper elevation={6} style={{
        margin: "0px -8px",
        zIndex: 3,
        color: "#fff",
        backgroundColor: "#263238",
    }}>
        <Grid container alignItems="center">
            <Grid item xs={12} sm={5} md={3}>
                <Col p={8}>
                    <Button color="inherit" component={Link} to={"/about"}>About us</Button>
                    <Button color="inherit" component={Link} to={"/policy"}>Privacy policy</Button>
                    <Button color="inherit" component={Link} to={"/tos"}>Terms of Service</Button>
                </Col>
            </Grid>
            <Grid item xs={12} sm={1} md={3} />
            <Grid item xs={12} sm={6} md={6}>
                <Col fullWidth s={8} p={8}>
                    <Typography variant="body2" color="inherit" align="center">© Truecost 2019-2020</Typography>
                    <Typography variant="body2" color="inherit" align="center">2885 Sanford
                        Ave SW #46305 Grandville, MI 49418</Typography>
                    <Row wrap>
                        {
                            social.map((item, index) => (
                                <SocialDialog key={`social-${index}`} button={
                                    (
                                        <IconButton color="inherit">
                                            {React.cloneElement(item.icon, {style: {color: "white"}})}
                                        </IconButton>
                                    )
                                } {...item} />
                            ))
                        }
                    </Row>
                </Col>
            </Grid>
        </Grid >
    </Paper>
);
