import React from "react";
import {Divider, Grid, Typography} from "@material-ui/core";
import {useStore} from "../../Data/Wrapper";
import {Meta} from "pages/Base/Meta";
import {HomeGameSelector} from "./HomeGameSelector";
import {dictSort} from "@truecost/shared";
import {GameTopOffers} from "../Shared/GameTopOffers";
import {GameInfo} from "../Shared/GameInfo";
import {HomeTrustPilot} from "./HomeTrustPilot";
import {HowToUse} from "pages/Base/HowToUse";
import {PersonalDiscount} from "pages/Base/PersonalDiscount";
import {Row} from "pages/Base/Grid";

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
    const gamesSorted = dictSort(games);

    const schema = {
        "@context": "https://schema.org/",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "TrueCost",
            "item": "https://truecost.gg/",
        }, ...Object.keys(games).map((gameId, i) => ({
            "@type": "ListItem",
            "position": (i + 2),
            "name": `${games[gameId].name}`,
            "item": `https://truecost.gg/${games[gameId].url}`,
        }))],
    };

    return (
        <React.Fragment>
            <Meta >
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            </Meta>
            <Grid container spacing={2}
                style={{
                    color: "#000",
                }}>
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
                    gamesSorted.map(gameId => (
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
                    {info(`How to use our service`)}
                </Grid>
                <Grid item xs={12}>
                    <HowToUse />
                </Grid>
            </Grid>
        </React.Fragment >
    );
};