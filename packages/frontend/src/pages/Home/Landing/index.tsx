import React from "react";
import {Grid, Typography} from "@material-ui/core";
import {useStore} from "../../Data/Wrapper";
import {Meta} from "pages/Base/Meta";
import {HomeGameSelector} from "./HomeGameSelector";
import {dictSort} from "@truecost/shared";
import {HomeGameTopOffers} from "./HomeGameTopOffers";
import {HomeGameInfo} from "./HomeGameInfo";
import {HowToUse} from "pages/Base/HowToUse";
import {PersonalDiscount} from "pages/Base/PersonalDiscount";

export const HomeLanding: React.FC = () => {
    const {games: {id: games}} = useStore();
    const gamesSorted = dictSort(games);

    return (
        <React.Fragment>
            <Meta />
            <Grid container spacing={4}
                style={{
                    color: "#000",
                }}>
                <Grid item xs={12}>
                    <Typography variant="h5">
                        {`Choose game you want to get services in:`}
                    </Typography>
                    <HomeGameSelector games={games} />
                </Grid>
                <Grid item xs={12}>
                    <PersonalDiscount />
                </Grid>
                {
                    gamesSorted.map(gameId => (
                        <Grid key={gameId} item xs={12}>
                            <>
                                <Typography variant="h5">
                                    {`${games[gameId].name} top deals`}
                                </Typography>
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