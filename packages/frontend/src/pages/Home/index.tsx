import React, {CSSProperties, useContext} from "react";
import {
    Button,
    ButtonBase,
    createStyles,
    Grid,
    Hidden,
    IconButton,
    makeStyles,
    Theme,
    Typography,
    Card,
} from "@material-ui/core";
import "css/float.css";
import {DataContext} from "../Data/Wrapper";
import Parallax from "components/Parallax";
import {HomeIntro} from "./HomeIntro";
import {HomeTrustPilot} from "./HomeTrustPilot";
import {HomeHowTo} from "./HomeHowTo";
import {HomeTwitter} from "./HomeTwitter";
import {backend} from "auxiliary/route";
import {HomeTopOffers} from "./HomeTopOffers";
import {HomeInfo} from "./HomeInfo";


interface IHomeProps {
}

const Home: React.FC<IHomeProps> = ({}): JSX.Element => {
    const {current: {game}} = useContext(DataContext);
    const current = game!;
    const image = `${backend.uri}/${current.id}/${current.background}/u.gif`

    return (
        <React.Fragment>
            <Parallax image={image} />
            <Grid container spacing={2}
                style={{
                    color: "#fff",
                }}>
                <Grid item xs={12} sm={4} md={6} />
                <Grid item xs={12} sm={8} md={6}>
                    <HomeIntro style={{marginTop: "15vh", textAlign: "center"}} />
                </Grid>
                <Grid container spacing={2}
                    style={{marginTop: "15vh", marginBottom: 16}}>
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
