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
import {Link} from "react-router-dom";
import TrustBox from "../Base/TrustBox";
import {ArrowDown} from "mdi-material-ui";
import "css/float.css";
import {Chat, Loyalty, RateReview, SportsEsports, Star} from "@material-ui/icons";
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import Meta from "../Base/Meta";
import {DataContext} from "../Data/Wrapper";
import Parallax from "components/Parallax";
import {baseUri} from "auxiliary/route";
import {Intro} from "./Intro";
import {TrustPilot} from "./TrustPilot";
import {HowTo} from "./HowTo";
import {Twitter} from "./Twitter";


interface IHomeProps {
}

const Home: React.FC<IHomeProps> = ({}): JSX.Element => {
    const {current: {game}} = useContext(DataContext);
    const current = game!;
    const image = `${baseUri}/${current.id}/${current.background}/u.jpg`
    
    return (
        <React.Fragment>
            <Parallax image={image} />
            <Grid container style={{
                color: "#fff",
            }}>
                    <Grid item xs={12} sm={4} md={6} />
            <Grid item xs={12} sm={8} md={6}>
                <Intro style={{marginTop: "15vh", textAlign: "center"}} />
            </Grid>
            <Grid container spacing={3}
                style={{marginTop: "15vh", marginBottom: 16}}>
                <Grid item xs={12} sm={8}>
                    {}
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Twitter />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <HowTo />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TrustPilot />
                </Grid>
            </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default Home;
