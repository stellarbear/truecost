import React, {useContext} from "react";
import {Button, ButtonBase, Card, Chip, Divider, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {CalcPrice} from '@truecost/shared';
import {PriceTypography} from "../Base/PriceTypography";
import {Col, Row} from "pages/Base/Grid";
import {SafeImage} from "components/SafeImage";
import {backend} from "auxiliary/route";
import CheckCircle from '@material-ui/icons/CheckCircle';

interface IProps {
    id: string;
    gameId?: string;
    gameUrl?: string;
    noprice?: boolean;
}

const ItemCard: React.FC<IProps> = (props) => {
    const {id, gameId, gameUrl, noprice = false} = props;

    const {current: {shop, game: {url}}, update: {cart, setGame}} = useContext(DataContext);
    const {
        tags,
        items,
    } = shop(gameId);

    if (id === undefined || !(id in items.id)) {
        return null;
    }

    const item = items.id[id];
    const itemPrice = CalcPrice.fromItem(item);
    const redirect = `/${gameUrl || url}/item/${item.url}`;

    const [raised, setRaised] = React.useState(false);

    const inYourCart = cart.count({itemId: item.id}) > 0;

    const chip = () => {
        const filtered = item.tag.filter(t => t in tags.id);

        return (
            <Col m={4} s={4}
                style={{position: "absolute", top: 0, left: 0}}>
                {filtered.length > 0 && (
                    <Chip
                        style={{
                            transition: "all 0.3s",
                            opacity: raised ? 1.0 : 0.6,
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

    const card = () => {
        const image = `${backend.uri}/${item.id}/${item.images[0]}/u.png`;
        return (
            <ButtonBase component={Link} to={redirect} onClick={() => {
                if (gameId) {
                    setGame(gameId);
                }
            }}
                style={{backgroundColor: 'transparent', padding: 0, height: "100%", width: "100%"}}>
                <Col fullWidth style={{width: "100%"}}>
                    {chip()}
                    {owned()}
                    <SafeImage
                        alt={`${item.name} image`}
                        height={300}
                        src={image} style={{objectFit: "contain", width: "inherit"}} />
                    <Divider />
                    <Row p={8} s={8}
                        justify="space-between"
                        align="center"
                        style={{height: 60}}>
                        <Typography variant="body1" align="center"
                            style={{maxHeight: 70, overflow: "hidden", width: "100%"}}>{item.name}</Typography>
                        {noprice || (
                            <Button
                                style={{minWidth: "fit-content"}}
                                size="large"
                                color="primary"
                                variant="outlined"
                            >
                                <PriceTypography price={itemPrice.value}
                                    discount={item.discount} />
                            </Button>
                        )}
                    </Row>
                </Col>
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
            raised={raised}>
            {card()}
        </Card>
    );
};

export default ItemCard;
