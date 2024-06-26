import React, {useContext} from "react";
import {Button, Card, Chip, Divider, NoSsr, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {CalcPrice} from '@truecost/shared';
import {PriceTypography} from "../Base/PriceTypography";
import {Col, Row} from "pages/Base/Grid";
import {SafeImage} from "components/SafeImage";
import {backend} from "auxiliary/route";
import CheckCircle from '@material-ui/icons/CheckCircle';
import {AddToCartDialog} from "pages/Base/AddToCartDialog";

interface IProps {
    id: string;
    gameId?: string;
    gameUrl?: string;
    ordered?: boolean;
}

const ItemCard: React.FC<IProps> = (props) => {
    const {id, gameId, gameUrl, ordered = false} = props;

    const {
        currency,
        current: {shop, game: {url}},
        update: {cart, setGame},
    } = useContext(DataContext);

    const {
        tags,
        items,
    } = shop(gameId);

    if (id === undefined || !(id in items.id)) {
        return null;
    }

    const item = items.id[id];
    const itemPrice = CalcPrice.fromItem(item, currency);
    const urlFixed = gameUrl || url;
    const redirect = `/${urlFixed}/item/${item.url}`;

    const [raised, setRaised] = React.useState(false);

    const inYourCart = cart.count({itemId: item.id}) > 0;

    const chip = () => {
        const filtered = item.tag.filter(t => t in tags.id);

        return (
            <Col m={4} s={4}
                style={{position: "absolute", top: 0, left: 0, zIndex: 5}}>
                {filtered.length > 0 && (
                    <Chip
                        style={{
                            transition: "all 0.3s",
                            opacity: raised ? 1.0 : 0.6,
                            ...(tags.id[filtered[0]].color ? {
                                backgroundColor: tags.id[filtered[0]].color,
                                color: "#fff",
                                opacity: 1,
                            } : {}),
                        }}
                        key={filtered[0]}
                        color={raised ? "primary" : undefined}
                        label={tags.id[filtered[0]].name}
                        size="small" />
                )}
            </Col>
        );
    };

    const owned = () => (
        <Row p={8} s={8} style={{
            position: "absolute", top: 0, right: 0,
        }}>
            {inYourCart && (
                <CheckCircle color="primary" />
            )}
        </Row>
    );

    const details = () => (
        <div
            style={{
                transition: "all 0.3s",
                position: "absolute",
                left: "50%", top: "50%",
                transform: "translate(-50%,-50%)",
                opacity: raised ? 1.0 : 0.0,
            }}
        >
            <Button variant="contained" color="secondary">Item details</Button>
        </div>
    );

    const overlay = () => (
        <div
            style={{
                transition: "all 0.3s",
                position: "absolute",
                left: 0, right: 0, top: 0, bottom: 0,
                background: raised ? "#00000066" : undefined,
            }}
        />
    );

    const card = () => {
        const image = `${backend.uri}/${item.id}/${item.images[0]}/u.png`;
        return (
            <Col fullWidth style={{width: "100%"}}>
                <Link to={redirect} onClick={() => {
                    if (gameId) {
                        setGame(gameId);
                    }
                }}>
                    <NoSsr>
                        {chip()}
                        {owned()}
                    </NoSsr>
                    <div style={{
                        backgroundColor: "#f4f4f4",
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        <SafeImage
                            alt={`${item.name} image`}
                            height={300}
                            src={image} style={{
                                objectFit: "contain", width: "inherit",
                                filter: "drop-shadow(10px 12px 9px #555)",
                            }} />
                        {overlay()}
                        {details()}
                    </div>
                </Link>
                <Divider />
                <Row p={8} s={8}
                    justify="space-between"
                    align="center"
                    style={{height: 60}}>
                    <Col fullWidth>
                        <Typography variant="body1" align="center"
                            style={{maxHeight: 70, overflow: "hidden", width: "100%"}}>
                            {item.name}
                        </Typography>
                    </Col>

                    <AddToCartDialog
                        url={urlFixed}
                        item={item}
                        options={[]}
                        chunk={item.range.d.length > 0
                            ? [item.range.d.first().a, item.range.d.last().a] : [0, 0]}
                        button={
                            <Button
                                style={{
                                    minHeight: 60,
                                    minWidth: "fit-content",
                                }}
                                size="large"
                                color="primary"
                                variant="outlined"
                            >
                                <Col>
                                    {item.range.d.length > 0 && (
                                        <Typography
                                            style={{
                                                fontSize: 10,
                                                marginBottom: -6,
                                            }}
                                            variant="caption">from</Typography>
                                    )}
                                    <PriceTypography price={itemPrice.value}
                                        discount={item.discount} />
                                </Col>
                            </Button>
                        }
                    />
                </Row>
                {
                    ordered && (
                        <>
                            <Divider />
                            <Typography variant="body2" align="center"
                                style={{
                                    maxHeight: 70, overflow: "hidden", width: "100%",
                                    padding: 8,
                                }}>
                                Ordered <strong>{` ${(item.buy) || 0} times`}</strong>
                            </Typography>
                        </>
                    )
                }
            </Col>
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
            raised={raised}>
            {card()}
        </Card>
    );
};

export default ItemCard;
