import * as React from "react";
import {Button, Grid, IconButton, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {social} from "auxiliary/social";
import SocialDialog from "../../Base/SocialDialog";
import {Col, Row} from "pages/Base/Grid";
import {useStore} from 'pages/Data/Wrapper';

export const FooterAbout: React.FC = () => {
    const {games: {id: games}} = useStore();
    const ids = Object.keys(games);

    return (
        <Grid container alignItems="flex-start" >
            <Grid item xs={12} sm={5} md={3}>
                <Col p={8} align="center">
                    <Typography variant="h5">
                        <b>About us</b>
                    </Typography>
                    <Button color="inherit" component={Link} to={"/contact"}>Contact us</Button>
                    <Button color="inherit" component={Link} to={"/policy"}>Privacy policy</Button>
                    <Button color="inherit" component={Link} to={"/tos"}>Terms of Service</Button>
                    <Button color="inherit" component={Link} to={"/blog"}>Our blog</Button>
                </Col>
            </Grid>
            <Grid item xs={12} sm={5} md={3}>
                <Col p={8} align="center">
                    <Typography variant="h5">
                        <b>Services</b>
                    </Typography>
                    {ids.map(gameId => (
                        <Button
                            key={gameId}
                            color="inherit"
                            component={Link}
                            to={'/' + games[gameId].url}>
                            {games[gameId].name}
                        </Button>
                    ))}
                </Col>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
                <Col s={8} p={8} style={{marginTop: 8}}>
                    <Typography variant="body2" color="inherit" align="center">
                        © TrueCost Inc 2020-2021
                    </Typography>
                    <Typography variant="body2" color="inherit" align="center">
                        30 N Gould St Ste R Sheridan, WY 82801
                    </Typography>
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
};
