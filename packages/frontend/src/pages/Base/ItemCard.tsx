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
import {imageUri, baseUri} from "auxiliary/route";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import DefaultImage from "components/DefaultImage";
import PriceTypo from "./PriceTypo";
import colors from "theme/colors";
import {CartContext} from "./CartWrapper";
import {DataContext} from "pages/Data/Wrapper";
import {IShop} from "pages/Data/useData";

interface IItemCardProps extends RouteComponentProps<{}> {
    id: string;
    adapt?: boolean;
}

const ItemCard: React.FC<IItemCardProps> = (props) => {
    const {
        id,
        adapt = false,
    } = props;
    const {notify} = useContext(NotificationContext);
    /*
        const {
            cart: {addItem},
            store: {itemList, optionList, tagList},
            math: {stringifyPrice, calculateAt, getItemPrice, getItemPriceWithDiscount},
        } = React.useContext(CartContext);
    */
    const {current: {shop}} = useContext(DataContext);
    const {
        tag: {id: tags},
        item: {id: items},
        option: {local: options},
        category: {id: categories}
    }: IShop = shop()!;

    if (id === undefined || !(id in items)) {
        return null;
    }

    const itemId = id;
    const item = items[id];

    const [totalPrice, setTotalPrice] = React.useState(item.price);
    const [raised, setRaised] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);
    const [selected, setSelected] = React.useState("");
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    useEffect(() => {
        //setTotalPrice(calculateAt(price, selectedOptions));
    }, [selectedOptions]);

    const toggleSelected = (id: string) =>
        setSelectedOptions(selectedOptions.includes(id) ? selectedOptions.filter(t => t !== id) : [...selectedOptions, id]);

    const renderSimplified = () => (
        <div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}>
            <Button
                component={Link}
                style={{padding: 20}}
                to={`item/${item.url}`}
            >
                Open item page
            </Button>
            <div style={{overflowY: "auto"}}>
                {item.option.length > 0 ? item.option.map(({id: optionId}) =>
                    <div key={`${itemId}-option-${optionId}`}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: 8,
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: optionId === selected ? "rgba(0, 0, 0, 0.15)" : "transparent",
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={() => setSelected(optionId)}
                            onMouseLeave={() => setSelected("")}
                            onClick={() => toggleSelected(optionId)}>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Checkbox
                                    checked={selectedOptions.includes(optionId)}
                                />
                                <Typography variant="body2"
                                    style={{userSelect: "none"}}>{options[optionId].name}</Typography>
                            </div>
                            <Typography variant="h6"
                                style={{
                                    userSelect: "none",
                                    whiteSpace: "nowrap",
                                    textAlign: "center",
                                }}>{/*stringifyPrice(o, id)*/}</Typography>
                        </div>
                        <Divider style={{paddingLeft: 8}} />
                    </div>,
                ) : (
                        <Typography style={{margin: 32, textAlign: "center"}}>No options available.</Typography>
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
                        //addItem(id, [], 1, selectedOptions);
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
        <ButtonBase component={Link} to={`item/${item.url}`} style={{height: "100%"}}>
            < div style={{display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between"}}>
                <Button
                    component={Link}
                    style={{padding: 20}}
                    to={`item/${item.url}`}
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
                            <Typography variant="h5">{/*`${range?.[0]?.price ?? price} $`*/}</Typography>
                        </div>
                    </Button>
                </div>
            </div>
        </ButtonBase>
    );

    const renderOverlay = () => {
        const canBeSimplified = item.range.length === 0;

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
        const image = `${baseUri}/${item.id}/${item.images[0]}/u.png`;
        return (
            <ButtonBase component={Link} to={`/item/${item.url}`}
                style={{backgroundColor: 'transparent', padding: 0, height: "100%"}}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    filter: hovered ? "blur(5px)" : "none",
                    transition: "all .3s",
                }}>
                    <div style={{margin: "0p 8px", marginBottom: -(28 * item.tag.length), zIndex: 20}}>
                        {item.tag.map(({id: tagId}) => tagId in tags && (
                            <div key={`item-${itemId}-tag-${tagId}`} style={{padding: "4px 0px 0px 4px"}}>
                                <Chip
                                    label={tags[tagId].name}
                                    color="primary" size="small" />
                            </div>
                        ))}
                    </div>
                    <img src={image} style={{objectFit: "contain", width: 300, minHeight: 300, }} />
                    <Divider style={{margin: 4}} />
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "space-evenly",
                    }}>
                        <Typography variant="body1" style={{
                            textAlign: "center", margin: 8,
                            width: "100%",
                        }}>{item.name}</Typography>
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
                                {`PRICE HERE`}
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
                position: "relative",
                cursor: "pointer",
            }}
            onMouseOver={() => setRaised(true)}
            onMouseOut={() => setRaised(false)}
            //onMouseLeave={() => setHovered(false)}
            raised={raised}>
            {renderOverlay()}
            {renderCard()}
        </Card>
    );
};

export default withRouter(ItemCard);


/*
<PriceTypo price={getItemPrice(id, [])}
priceWithDiscount={getItemPriceWithDiscount(id, [])}/>
*/