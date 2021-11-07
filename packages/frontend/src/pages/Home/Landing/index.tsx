import React from "react";
import {Divider, Grid, Typography} from "@material-ui/core";
import {useStore} from "../../Data/Wrapper";
import {Meta} from "pages/Base/Meta";
import {HomeGameSelector} from "./HomeGameSelector";
import {GameTopOffers} from "../Shared/GameTopOffers";
import {GameInfo} from "../Shared/GameInfo";
import {HomeTrustPilot} from "./HomeTrustPilot";
import {PersonalDiscount} from "pages/Base/PersonalDiscount";
import {Row} from "pages/Base/Grid";
import {text} from "./data";
import {SeoText} from "pages/Shop/ShopSeo";

const info = (text: string) => (
    <Row s={16} align="center"
        style={{padding: "16px 16px 0px 16px", color: "#000"}}>
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
    const ids = Object.keys(games);

    return (
        <React.Fragment>
            <Meta />
            <Grid container spacing={2}
                style={{
                    color: "#000",
                }}>
                <Grid item xs={12} >
                    <Typography variant="h4" component="h1">
                        Boosting Service by TrueCost
                    </Typography>
                </Grid>
                <Grid item xs={12} >
                    {info(`Select game`)}
                </Grid>
                <Grid item xs={12} >
                    <HomeGameSelector games={games} />
                </Grid>
                <Grid item xs={12}>
                    <PersonalDiscount />
                </Grid>
                {
                    ids.map(gameId => (
                        <React.Fragment key={gameId}>
                            <Grid item xs={12} >
                                {info(`${games[gameId].name} top deals`)}
                            </Grid>
                            <Grid key={gameId} item xs={12}>
                                <GameTopOffers game={games[gameId]} />
                                <GameInfo game={games[gameId]} />
                            </Grid>
                        </React.Fragment>
                    ))
                }
                <Grid item xs={12}>
                    <HomeTrustPilot />
                </Grid>

                <Grid item xs={12}>
                    {info(`What is TrueCost.gg`)}
                </Grid>
                <Grid item xs={12}>
                    <SeoText text={text} />
                </Grid>
            </Grid>
        </React.Fragment >
    );
};
