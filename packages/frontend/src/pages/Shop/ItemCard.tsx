import React, {useContext, useEffect} from "react";
import {
    Button,
    ButtonBase,
    Card,
    Chip,
    Divider,
    Typography,
} from "@material-ui/core";
import {NotificationContext} from "../../components/wrappers";
import {Link, RouteComponentProps, withRouter, Redirect} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {Price, Time} from '@truecost/shared';
import {PriceTypography} from "../Base/PriceTypography";
import {ItemCardBase} from "./Card/ItemCardBase";
import {ItemCardRange} from "./Card/ItemCardRange";
import {Col, Row} from "pages/Base/Grid";
import {SafeImage} from "components/SafeImage";
import {backend} from "auxiliary/route";
import CheckCircle from '@material-ui/icons/CheckCircle';

interface IItemCardProps extends RouteComponentProps<{}> {
    id: string;
}

//const size = 284;
const ItemCard: React.FC<IItemCardProps> = (props) => {
    const {id} = props;

    const {notify} = useContext(NotificationContext);
    const {current: {shop, game: {url}}, update: {cart}} = useContext(DataContext);
    const {
        tags,
        items,
    } = shop();

    if (id === undefined || !(id in items.id)) {
        return null;
    }

    const item = items.id[id];
    const price = Price.fromItem(item);
    const redirect = `/${url}/item/${item.url}`;

    const [raised, setRaised] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

    const inYourCart = cart.count({itemId: item.id}) > 0;

    const overlay = () => (
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
                item.range.d.length === 0
                    ? <ItemCardBase item={item} redirect={redirect} price={price} />
                    : <ItemCardRange item={item} redirect={redirect} price={price} />
            }
        </div>
    );

    const chip = () => {
        const filtered = item.tag.filter(t => t in tags.id);

        return (
            <Col left m={4} s={4}
                style={{position: "absolute", top: 0, left: 0}}>
                {filtered.length > 0 && (
                    <Chip
                        key={filtered[0]}
                        label={tags.id[filtered[0]].name}
                        color="primary" size="small" />
                )}
            </Col>
        )
    }

    const eta = () => (
        <Row p={8} s={8} style={{
            position: "absolute", top: 0, right: 0,
        }}>
            {inYourCart && (
                <CheckCircle color="primary" />
            )}
        </Row>
    )

    const card = () => {
        const image = `${backend.uri}/${item.id}/${item.images[0]}/u.png`;
        return (
            <ButtonBase component={Link} to={redirect}
                style={{backgroundColor: 'transparent', padding: 0, height: "100%"}}>
                <Col fullWidth>
                    {chip()}
                    {eta()}
                    <SafeImage src={image} style={{objectFit: "contain", width: "inherit"}} />

                    <Divider />
                    <Row between p={8} s={8} width={["100%", "auto"]}>
                        <Typography variant="body1" align="center">{item.name}</Typography>
                        <Button
                            onMouseEnter={() => setHovered(true)}
                            size="large"
                            color="primary"
                            variant="outlined"
                        >
                            <PriceTypography price={price.toValue}
                                discount={item.discount} />
                        </Button>
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
            onMouseLeave={() => setHovered(false)}
            raised={raised}>
            {overlay()}
            {card()}
        </Card>
    );
};

export default withRouter(ItemCard);
