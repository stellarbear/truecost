import React from "react";
import {Grid, Typography, Divider, IconButton} from "@material-ui/core";
import {useStore} from "../Data/Wrapper";
import {HomeIntro} from "./HomeIntro";
import {HomeTrustPilot} from "./HomeTrustPilot";
import {HomeHowTo} from "./HomeHowTo";
import {HomeTwitter} from "./HomeTwitter";
import {backend} from "auxiliary/route";
import {HomeTopOffers} from "./HomeTopOffers";
import {HomeInfo} from "./HomeInfo";
import {Meta} from "pages/Base/Meta";
import {HomeImage} from "./HomeImage";
import {Row} from "pages/Base/Grid";
import {HomeGames} from "./HomeGames";
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import {Link} from "react-router-dom";
import {HomeCurtain} from "./HomeCurtain";

const info = (text: string, prefix?: React.ReactNode) => (
    <Row s={16} even width={["auto", "auto", "100%"]}
        style={{padding: "16px 16px 0px 16px", color: "#000"}}>
        {prefix || <div />}
        <Typography variant="h6" noWrap>{text}</Typography>
        <Divider style={{backgroundColor: "#000", opacity: 0.4}} />
    </Row>
);

const Home: React.FC = () => {
    const {current: {game}} = useStore();
    const url = '/' + game.url;
    const image = `${backend.uri}/${game.id}/${game.background}/u.jpg`;

    return (
        <React.Fragment>
            <Meta entity={game} />
            <HomeImage src={image} />
            <Grid container
                style={{
                    color: "#fff",
                }}>
                <Grid container direction="row-reverse" style={{marginBottom: "5vh"}} >
                    <Grid item xs={12} sm={12} md={6}>
                        <HomeIntro style={{margin: "10vh 0", textAlign: "center"}} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        {/*<HomeRange />*/}
                    </Grid>
                </Grid>
                <div style={{
                    position: "relative",
                    width: "inherit",

                }}>
                    <HomeCurtain/>
                    <Grid container spacing={2} style={{margin: "0px 0px 16px -8px"}}>
                        <Grid item xs={12}>
                            {info(`Top deals`,
                                <IconButton component={Link} to={url + "/shop"}>
                                    <ShoppingBasket />
                                </IconButton>,
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <HomeTopOffers />
                        </Grid>
                        <Grid item xs={12}>
                            {info(`Game services`)}
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <HomeGames />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <HomeTrustPilot />
                        </Grid>
                        <Grid item xs={12}>
                            {info(`${game.name} news`)}
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <HomeInfo />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <HomeTwitter />
                        </Grid>
                        <Grid item xs={12}>
                            {info(`How to use our service`)}
                        </Grid>
                        <Grid item xs={12}>
                            <HomeHowTo />
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </React.Fragment >
    );
};

export default Home;
