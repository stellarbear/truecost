import React from "react";
import {Grid} from "@material-ui/core";
import "css/float.css";
import {useStore} from "../Data/Wrapper";
import Parallax from "components/Parallax";
import {HomeIntro} from "./HomeIntro";
import {HomeTrustPilot} from "./HomeTrustPilot";
import {HomeHowTo} from "./HomeHowTo";
import {HomeTwitter} from "./HomeTwitter";
import {backend} from "auxiliary/route";
import {HomeTopOffers} from "./HomeTopOffers";
import {HomeInfo} from "./HomeInfo";
import {Meta} from "pages/Base/Meta";

const Home: React.FC = () => {
    const {current: {game}} = useStore();
    const image = `${backend.uri}/${game.id}/${game.background}/u.jpg`;

    return (
        <React.Fragment>
            <Meta entity={game}/>
            <Parallax image={image}/>
            <Grid container spacing={2}
                  style={{
                      color: "#fff",
                  }}>
                <Grid item xs={12} sm={4} md={6}/>
                <Grid item xs={12} sm={8} md={6}>
                    <HomeIntro style={{marginTop: "15vh", textAlign: "center"}}/>
                </Grid>
                <Grid container spacing={2}
                      style={{marginTop: "15vh", marginBottom: 16}}>
                    <Grid item xs={12} sm={8}>
                        <HomeInfo/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <HomeTwitter/>
                    </Grid>
                    <Grid item xs={12}>
                        <HomeTopOffers/>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <HomeHowTo/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <HomeTrustPilot/>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default Home;
