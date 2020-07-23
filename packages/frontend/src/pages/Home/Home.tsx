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
import {serverUri} from "auxiliary/route";
import {Intro} from "./Intro";
import {TrustPilot} from "./TrustPilot";
import {HowTo} from "./HowTo";
import {Twitter} from "./Twitter";


interface IHomeProps {
}

const Home: React.FC<IHomeProps> = ({}): JSX.Element => {
    const {current: {game}} = useContext(DataContext);
    const current = game!;
    const image = `${serverUri}/${current.id}/${current.background}/u.jpg`

    return (
        <React.Fragment>
            <Parallax image={image}/>
            <Grid container spacing={2}
                  style={{
                      color: "#fff",
                  }}>
                <Grid item xs={12} sm={4} md={6}/>
                <Grid item xs={12} sm={8} md={6}>
                    <Intro style={{marginTop: "15vh", textAlign: "center"}}/>
                </Grid>
                <Grid container spacing={2}
                      style={{marginTop: "15vh", marginBottom: 16}}>
                    <Grid item xs={12} sm={8}>
                        {}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Twitter/>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <HowTo/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TrustPilot/>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

export default Home;
