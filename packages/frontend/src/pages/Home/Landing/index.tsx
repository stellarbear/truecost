import React from "react";
import {Divider, Grid, Typography} from "@material-ui/core";
import {useStore} from "../../Data/Wrapper";
import {Meta} from "pages/Base/Meta";
import {HomeGameSelector} from "./HomeGameSelector";
import {dictSort} from "@truecost/shared";
import {HomeGameTopOffers} from "./HomeGameTopOffers";
import {HomeGameInfo} from "./HomeGameInfo";
import {HowToUse} from "pages/Base/HowToUse";
import {PersonalDiscount} from "pages/Base/PersonalDiscount";
import {Row} from "pages/Base/Grid";

const info = (text: string) => (
    <Row s={16} align="center"
        style={{paddingBottom: 16, color: "#000"}}>
        <Typography variant="h4" noWrap style={{
            minWidth: "fit-content",
            fontWeight: 300,
        }}>
            {text}
        </Typography>
        <div style={{width: "100%"}}>
            <Divider style={{backgroundColor: "#000", opacity: 0.4}} />
        </div>
    </Row>
);

export const HomeLanding: React.FC = () => {
    const {games: {id: games}} = useStore();
    const gamesSorted = dictSort(games);

    return (
        <React.Fragment>
            <Meta />
            <Grid container spacing={6}
                style={{
                    color: "#000",
                }}>
                <Grid item xs={12} >
                    {info(`Select game`)}
                    <HomeGameSelector games={games} />
                </Grid>
                <Grid item xs={12}>
                    <PersonalDiscount />
                </Grid>
                {
                    gamesSorted.map(gameId => (
                        <Grid key={gameId} item xs={12}>
                            <>
                                {info(`${games[gameId].name} top deals`)}
                                <HomeGameTopOffers game={games[gameId]} />
                                <HomeGameInfo game={games[gameId]} />
                            </>
                        </Grid>
                    ))
                }
                <Grid item xs={12}>
                    <HowToUse />
                </Grid>
            </Grid>
        </React.Fragment >
    );
};