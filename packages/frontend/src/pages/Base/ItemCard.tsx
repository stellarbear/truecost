import React, {useContext, useEffect} from "react";
import {
    Button,
    ButtonBase,
    Card,
    Checkbox,
    Chip,
    createStyles,
    Divider,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import {NotificationContext} from "../../components/wrappers";
import {imageUri} from "auxiliary/route";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import DefaultImage from "components/DefaultImage";
import PriceTypo from "./PriceTypo";
import colors from "theme/colors";
import {CartContext} from "./CartWrapper";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        size: {
            [theme.breakpoints.up(658)]: {
                width: 300,
                minHeight: 300,
            },
            [theme.breakpoints.down(658)]: {
                width: 200,
                minHeight: 200,
            },
        },
        font: {
            [theme.breakpoints.up(658)]: {
                //width: "100%",
                minWidth: 80,
            },
            [theme.breakpoints.down(658)]: {
                fontSize: "0.8rem",
                minWidth: 40,
            },
        },
        display: {
            [theme.breakpoints.up(658)]: {
                flexDirection: "row",
            },
            [theme.breakpoints.down(658)]: {
                flexDirection: "column",
            },
        },
    }),
);

const mockStyles = makeStyles((theme: Theme) =>
    createStyles({
        size: {
            width: 300,
            minHeight: 300,
        },
        font: {
            minWidth: 80,
        },
        display: {
            flexDirection: "row",
        },
    }),
);

interface IItemCardProps extends RouteComponentProps<{}> {
    id: string;
    adapt?: boolean;
}

const ItemCard: React.FC<IItemCardProps> = ({
                                                id,
                                                history,
                                                adapt = false,
                                            }) => {
    const classes = adapt ? useStyles() : mockStyles();
    const {notify} = useContext(NotificationContext);

    const {
        cart: {addItem},
        store: {itemList, optionList, tagList},
        math: {stringifyPrice, calculateAt, getItemPrice, getItemPriceWithDiscount},
    } = React.useContext(CartContext);

    if (id === undefined) {
        return null;
    }

    const {option, price, items, tag, name, range} = itemList[id];

    const [totalPrice, setTotalPrice] = React.useState(price);
    const [raised, setRaised] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [selected, setSelected] = React.useState("");
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    useEffect(() => {
        setTotalPrice(calculateAt(price, selectedOptions));
    }, [selectedOptions]);

    const toggleSelected = (id: string) =>
        setSelectedOptions(selectedOptions.includes(id) ? selectedOptions.filter(t => t !== id) : [...selectedOptions, id]);

    const renderSimplified = () => (
        <div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}>
            <Button
                component={Link}
                style={{padding: 20}}
                to={`item/${itemList[id].url}`}
            >
                Open item page
            </Button>
            <div style={{overflowY: "auto"}}>
                {option.map(o =>
                    <div key={`${id}-option-${o}`}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: 8,
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: o === selected ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={() => setSelected(o)}
                            onMouseLeave={() => setSelected("")}
                            onClick={() => toggleSelected(o)}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Checkbox
                                    checked={selectedOptions.includes(o)}
                                />
                                <Typography
                                    className={classes.font} variant="body2"
                                    style={{userSelect: "none"}}>{optionList[o].name}</Typography>
                            </div>
                            <Typography
                                className={classes.font} variant="h6"
                                style={{
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                }}>{stringifyPrice(o, id)}</Typography>
                        </div>
                        <Divider style={{paddingLeft: 8}}/>
                    </div>,
                )}
            </div>
            <div style={{display: 'flex', justifyContent: "center"}}>
                <Button
                    style={{
                        width: "100%",
                        whiteSpace: "nowrap",
                        height: 60,
                    }}
                    size="large"
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        addItem(id, [], 1, selectedOptions);
                        notify(`${name} was added to your cart!`);
                    }}
                >
                    <div
                        style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                        <Typography variant="caption">add to cart</Typography>
                        <Typography variant="h5">{`${totalPrice} $`}</Typography>
                    </div>
                </Button>
            </div>
        </div>
    );

    const renderMock = () => (
        <ButtonBase component={Link} to={`item/${itemList[id].url}`} style={{height: "100%"}}>
            < div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}>
                <Button
                    component={Link}
                    style={{padding: 20}}
                    to={`item/${itemList[id].url}`}
                >
                    Open item page
                </Button>
                <div style={{
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    flexDirection: "column",
                }}>
                    <Typography style={{margin: 32, textAlign: "center"}}>This price is variable. Go to item page in
                        order to configure it.</Typography>
                </div>
                <div style={{display: 'flex', justifyContent: "center"}}>
                    <Button
                        style={{
                            width: "100%",
                            whiteSpace: "nowrap",
                            height: 60,
                        }}
                        size="large"
                        color="primary"
                        variant="contained"
                    >
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}>
                            <Typography variant="caption">starting from </Typography>
                            <Typography className={classes.font}
                                        variant="h5">{`${range?.[0]?.price ?? price} $`}</Typography>
                        </div>
                    </Button>
                </div>
            </div>
        </ButtonBase>
    );

    const renderOverlay = () => {
        const canBeSimplified = range.length === 0;

        return (
            <div
                style={{
                    position: "absolute",
                    top: hovered ? 0 : "100%",
                    height: "100%", width: "100%",
                    backgroundColor: "#FFFFFFDD",
                    transition: "all 0.3s", zIndex: 30,
                }}
                onClick={(event) => event.stopPropagation()}>
                {
                    canBeSimplified
                        ? renderSimplified()
                        : renderMock()
                }
            </div>
        );
    };

    const renderCard = () => {
        return (
            <ButtonBase component={Link} to={`/item/${itemList[id].url}`}
                        style={{backgroundColor: 'transparent', padding: 0, height: "100%"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    filter: hovered ? "blur(5px)" : "none",
                    transition: "all .3s",
                }}>
                    <div style={{margin: "0p 8px", marginBottom: -(28 * tag.length), zIndex: 20}}>
                        {tag.map(t => t in tagList ? (
                            <div key={`item-${id}-tag-${t}`} style={{padding: "4px 0px 0px 4px"}}>
                                <Chip
                                    avatar={tagList[t].discount > 0
                                        ? <Chip color="secondary"
                                                style={{width: "fit-content", backgroundColor: colors.accentColor}}
                                                label={`${tagList[t].discount} % sale`}/>
                                        : undefined}
                                    label={tagList[t].name}
                                    color="primary" size="small"/>
                            </div>
                        ) : null)}
                    </div>
                    <DefaultImage className={classes.size} key={`${id}-image`}
                                  src={imageUri("item", id)}
                                  srcSet={`${imageUri("item", id, "img-200w")} 200w,
                            ${imageUri("item", id, "img-300w")} 300w`}
                                  sizes={`(max-width: 658px) 200px,
                            300px`}
                                  style={{objectFit: "contain"}}/>
                    <Divider style={{margin: 4}}/>
                    <div className={classes.display} style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "space-evenly",
                    }}>
                        <Typography className={classes.font} variant="body1" style={{
                            textAlign: "center", margin: 8,
                            width: "100%",
                        }}>{name}</Typography>
                        <div style={{display: "flex", whiteSpace: "nowrap", alignItems: "center"}}>
                            <Button
                                style={{
                                    minWidth: 100,
                                    margin: "4px 8px 8px 0px",
                                    whiteSpace: "nowrap",
                                }}
                                onMouseEnter={() => setHovered(true)}
                                size="large"
                                color="primary"
                                variant="outlined"
                            >
                                <PriceTypo price={getItemPrice(id, [])}
                                           priceWithDiscount={getItemPriceWithDiscount(id, [])}/>
                            </Button>
                        </div>
                    </div>
                </div>
            </ButtonBase>
        );
    };

    return (
        <Card
            style={{
                //margin: "8px auto",
                height: "100%",
                position: "relative",
                cursor: "pointer",
                minWidth: "fit-content",
            }}
            onMouseOver={() => setRaised(true)}
            onMouseOut={() => setRaised(false)}
            onMouseLeave={() => setHovered(false)}
            raised={raised}>
            {renderOverlay()}
            {renderCard()}
        </Card>
    );
};

export default withRouter(ItemCard);
