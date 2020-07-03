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
} from "@material-ui/core";
import {Link} from "react-router-dom";
import TrustBox from "./Base/TrustBox";
import {ArrowDown} from "mdi-material-ui";
import "css/float.css";
import {Chat, Loyalty, RateReview, SportsEsports, Star} from "@material-ui/icons";
import Row from "./Base/Row";
import {TwitterTimelineEmbed} from 'react-twitter-embed';
import Meta from "./Base/Meta";
import {DataContext} from "./Base/DataWrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            position: "relative",
            zIndex: 5,
            maxWidth: 1600,
            boxShadow:
                "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
            [theme.breakpoints.down(658)]: {
                width: "calc(100% - 20px)",
                margin: "10px 10px 0px",
            },
            [theme.breakpoints.up(658)]: {
                width: "calc(100% - 60px)",
                margin: "30px 30px 0px",
            },
            [theme.breakpoints.up(1660)]: {
                margin: "30px auto 0px",
            },
        },
    }),
);

interface IHomeProps {
}

const Home: React.FC<IHomeProps> = ({}): JSX.Element => {
    const {store: {game: {data: games, current}}} = useContext(DataContext);
    const currentGame = games[current!];
    const classes = useStyles();
    //const { store: { itemList, adList, categoryList, tagList, passList }, math: { collectDiscounts } } = React.useContext(CartContext);

    //const maxDiscount = collectDiscounts(Object.keys(passList), []).discount;

    const renderIntro = (style: CSSProperties = {}) => {
        return (
            <div style={style}>
                <Typography variant="h4">{`${currentGame.name} premium service`}</Typography>
                <Typography variant="body1">boosting, coaching, carry</Typography>
            </div>
        );
    };

    const renderDiscount = (style: CSSProperties = {}) => {
        return (
            <div style={style}>
                <Typography variant="h4" component="p" color="inherit">Get your personal up&nbsp;to</Typography>
                <Button
                    component={Link}
                    to="discount"
                    style={{marginTop: 8}}
                    variant="contained"
                    color="secondary">
                    <Typography variant="h6" color="inherit">{`SOME % discount `}</Typography>
                </Button>
                <Typography variant="body1" color="inherit" style={{marginTop: 6}}>{`on everything`}</Typography>
            </div>
        );
    };

    const renderCarousel = (style: CSSProperties = {}) => {
        /*const adIds = Object.keys(adList);
        sortByOrder(adIds, adList);

        return (adIds.length
            ? (
                <div className={classes.margin} style={{
                    ...style,
                    maxHeight: 300,
                    color: "#fff",
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    //overflow: "hidden",
                    minHeight: 90,
                }}>

                    <Carousel arrows={false} >
                        {adIds.map(key => {
                            const ad = adList[key];
                            const redirect = !!ad.redirect.length;
                            const to = redirect ? ad.redirect : "/shop";

                            return (
                                <ButtonBase key={`ad-${key}`} component={Link} to={to} style={{
                                    height: "100%", cursor: "pointer",
                                    position: "relative"
                                }} onClick={() => {
                                    if (redirect) {
                                        return;
                                    }

                                    Storage.setItem(storagePaginationKey, {
                                        ...defaultPaginationState,
                                        skip: 0,
                                    });

                                    Storage.setItem(storageShopKey, {
                                        ...defaultShopState,
                                        activeTags: ad.tag.filter(t => t in tagList),
                                        activeItems: ad.item.filter(i => i in itemList),
                                        activeCategory: ad.category in categoryList ? ad.category : '',
                                    });
                                }}>
                                    <div>
                                        <DefaultImage
                                            src={imageUri("carousel", key)}
                                            srcSet={`${imageUri("carousel", key, "img-600w")} 600w,
                                                        ${imageUri("carousel", key, "img-800w")} 800w,
                                                        ${imageUri("carousel", key, "img-1200w")} 1200w,
                                                        ${imageUri("carousel", key, "img-1600w")} 1600w,`}
                                            sizes={`(max-width: 700px) 600px,
                                                        (max-width: 1000px) 800px,
                                                        (max-width: 1400px) 1200px,
                                                        1600px,`}
                                            style={{ objectFit: "contain" }} />
                                    </div>
                                    <div style={{
                                        position: "absolute", width: "100%", height: "100%", padding: 30,
                                        maxHeight: 300
                                    }}>
                                        <div style={{ margin: 16, display: "flex", flexDirection: "column" }}>
                                            <Typography color="inherit" variant="h4">{adList[key].name}</Typography>
                                            <Typography color="inherit" variant="h6" style={{ whiteSpace: "pre-line" }}>{adList[key].text}</Typography>
                                        </div>
                                    </div>
                                </ButtonBase>
                            )
                        })}
                    </Carousel>
                </div>
            )
            : null
        )*/
    };

    const renderTwitter = (style: CSSProperties = {}) => {
        return (
            <Hidden smDown>
                <div className={classes.margin} style={{
                    ...style,
                    display: 'grid',
                    borderRadius: "6px",
                    background: "#FFFFFF",
                    minWidth: 400, maxWidth: 400,
                    minHeight: 90,
                }}>
                    <TwitterTimelineEmbed
                        style={{marginRight: -18}}
                        noHeader
                        noBoarders
                        sourceType="profile"
                        screenName={currentGame.twitter}
                        options={{height: 420, marginRight: -18}}/>
                </div>
            </Hidden>
        );
    };

    const renderTrustBox = (style: CSSProperties = {}) => {
        return (
            <div className={classes.margin} style={{
                ...style,
                display: 'grid',
                borderRadius: "6px",
                background: "#FFFFFF",
                //overflow: "hidden",
                minHeight: 90,
            }}>
                <ButtonBase>
                    <TrustBox size="big"/>
                </ButtonBase>
            </div>
        );
    };

    const renderRange = (style: CSSProperties = {}) => {
        /*const rangeIds = Object.keys(itemList).filter(key => itemList[key].range.length > 0);
        sortByOrder(rangeIds, itemList);

        if (rangeIds.length === 0) {
            return;
        }

        return (
            <div className={classes.margin} style={{
                ...style,
                borderRadius: "6px",
                background: "#FFFFFF",
                //overflow: "hidden",
                minHeight: 90,
            }}>
                <ItemTab items={rangeIds} />
            </div>
        ) */
    };

    const renderItemRow = (style: CSSProperties = {}) => {
        /*const topOffers = Object.keys(itemList).filter(key => itemList[key].isTopOffer === true);
        sortByOrder(topOffers, itemList);

        if (topOffers.length === 0) {
            return;
        }

        return (
            <div className={classes.margin} style={{
                ...style,
                borderRadius: "6px",
                background: "#FFFFFF",
            }}>
                <ItemRow id={"top-offers"} items={topOffers} />
            </div>
        )*/
    };

    const renderHowTo = (style: CSSProperties = {}) => {
        const data = [{
            icon: <SportsEsports/>,
            text: "Choose the items or the service you need at the shop",
        }, {
            icon: <Loyalty/>,
            text: "Select your discount plan at the checkout (optional)",
        }, {
            icon: <Chat/>,
            text: "We set up a convenient interaction between you and your player",
        }, {
            icon: <Star/>,
            text: "Get what you want!",
        }, {
            icon: <RateReview/>,
            text: "Leave an honest review in order to support us!",
        }];
        return (
            <div className={classes.margin} style={{
                ...style,
                borderRadius: "6px",
                background: "#FFFFFF",
            }}>
                <Row id={"how-it-works"}>
                    {data.map(({icon, text}, i) => (
                        <div key={`how-to-${i}`}>
                            <div style={{
                                width: 200,
                                margin: "0px 8px",
                                alignItems: "center",
                                display: 'flex', flexDirection: 'column',
                            }}>
                                {React.cloneElement(icon, {
                                    style: {
                                        transform: "scale(2.7)", margin: 32,
                                    },
                                })}
                                <Typography style={{textAlign: 'center'}}>
                                    {`${i + 1}. ${text}`}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </Row>
            </div>
        );
    };

    const renderGoBottomButton = (style: CSSProperties = {}) => {
        return (
            <IconButton
                className="float"
                style={{...style, backgroundColor: "#fff"}
                }
                onClick={() => window.scrollBy({top: 400, behavior: "smooth"})}>
                <ArrowDown/>
            </IconButton>
        );
    };

    const renderDesktop = () => {
        return (
            <React.Fragment>
                {/*<Parallax image={`/${baseGame}/home.jpg`} />*/}
                <Grid container className={classes.margin} style={{
                    boxShadow: "none",
                    marginTop: "25vh",
                }}>
                    <Grid item xs={12} sm={4} md={6}/>
                    <Grid item xs={12} sm={8} md={6} style={{color: "#fff"}}>
                        {renderIntro()}
                        {renderDiscount({marginTop: 32})}
                    </Grid>
                </Grid>
                <div style={{marginTop: "25vh", display: "flex", boxShadow: "none"}} className={classes.margin}>
                    <div style={{maxWidth: 'calc(100% - 430px)'}}>
                        {renderTrustBox({maxWidth: 1170, marginLeft: 0, marginRight: 0, width: "100%"})}
                        {/*renderCarousel({ maxWidth: 1170, marginLeft: 0, marginRight: 0, width: "100%" })*/}
                    </div>
                    {renderTwitter({marginRight: 0})}
                </div>
                {/*renderRange()}
				{renderItemRow()*/}
                {renderHowTo()}
            </React.Fragment>
        );
    };

    const renderMobile = () => {
        return (
            <React.Fragment>
                {/*<Parallax image={`/${baseGame}/home.jpg`} />*/}
                <div className={classes.margin} style={{
                    color: "#fff",
                    textAlign: "center",
                    boxShadow: "none",
                    marginTop: "25vh",
                }}>
                    {renderIntro()}
                    {renderDiscount({marginTop: 32})}
                    {renderGoBottomButton({marginTop: 32})}
                </div>
                {renderTrustBox({marginTop: "10vh"})}
                {/*renderCarousel()}
				{renderRange()}
			{renderItemRow()*/}
                {renderHowTo()}
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <Meta page="home"/>
            <Hidden xsDown>
                {renderDesktop()}
            </Hidden>
            <Hidden smUp>
                {renderMobile()}
            </Hidden>
        </React.Fragment>
    );
};

export default Home;
