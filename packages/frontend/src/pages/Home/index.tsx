import React from "react";
import {Grid} from "@material-ui/core";
import "css/float.css";
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

const Home: React.FC = () => {
    const {current: {game}} = useStore();
    const image = `${backend.uri}/${game.id}/${game.background}/u.jpg`;

    return (
        <React.Fragment>
            <Meta entity={game} />
            <HomeImage src={image} />
            <Grid container
                style={{
                    color: "#fff",
                }}>
                <Grid container direction="row-reverse" >
                    <Grid item xs={12} sm={12} md={6}>
                        <HomeIntro style={{margin: "10vh 0", textAlign: "center"}} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6}>
                        {/*<HomeRange />*/}
                    </Grid>
                </Grid>
                <Grid container spacing={2} style={{margin: "16px 0px 16px -8px"}}>
                    <Grid item xs={12} sm={8}>
                        <HomeInfo />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <HomeTwitter />
                    </Grid>
                    <Grid item xs={12}>
                        <HomeTopOffers />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <HomeHowTo />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <HomeTrustPilot />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default Home;
