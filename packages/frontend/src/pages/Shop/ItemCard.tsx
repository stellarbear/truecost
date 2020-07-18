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
import {imageUri, baseUri} from "auxiliary/route";
import {Link, RouteComponentProps, withRouter, Redirect} from "react-router-dom";
import {DataContext} from "pages/Data/Wrapper";
import {Price} from '@truecost/shared';
import {PriceTypography} from "../Base/PriceTypography";
import {ItemCardBase} from "./Card/ItemCardBase";
import {ItemCardRange} from "./Card/ItemCardRange";
import {Col, Row} from "pages/Base/Grid";

interface IItemCardProps extends RouteComponentProps<{}> {
    id: string;
}

const ItemCard: React.FC<IItemCardProps> = (props) => {
    const {id} = props;

    const {notify} = useContext(NotificationContext);
    const {current: {shop, game: {url}}} = useContext(DataContext);
    const {
        tags,
        items,
    } = shop();

    if (id === undefined || !(id in items.id)) {
        return null;
    }

    const itemId = id;
    const item = items.id[id];
    const price = Price.fromItem(item);
    const redirect = `/${url}/item/${item.url}`;

    const [raised, setRaised] = React.useState(false);
    const [hovered, setHovered] = React.useState(false);

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
                item.range.length === 0
                    ? <ItemCardBase item={item} redirect={redirect} price={price} />
                    : <ItemCardRange item={item} redirect={redirect} price={price} />
            }
        </div>
    );

    const chip = () => (
        <Col spacing={1} left margin={4}
            style={{position: "absolute", top: 0, left: 0}}>
            {item.tag.map(({id: tagId}) => tagId in tags.id && (
                <Chip
                    label={tags.id[tagId].name}
                    color="primary" size="small" />
            ))}
        </Col>
    )

    const card = () => {
        const image = `${baseUri}/${item.id}/${item.images[0]}/u.png`;
        return (
            <ButtonBase component={Link} to={redirect}
                style={{backgroundColor: 'transparent', padding: 0, height: "100%"}}>
                <Col fullWidth spacing={1}>
                    {chip()}
                    <img src={image} style={{objectFit: "contain", width: 300, minHeight: 300, }} />
                    <Divider />
                    <Row between padding={4}>
                        <Typography variant="body1" >{item.name}</Typography>
                        <Button
                            style={{
                                minWidth: 100,
                                whiteSpace: "nowrap",
                            }}
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
                margin: 16,
                position: "relative",
                cursor: "pointer",
            }}
            onMouseOver={() => setRaised(true)}
            //onMouseOut={() => setRaised(false)}
            //onMouseLeave={() => setHovered(false)}
            raised={raised}>
            {overlay()}
            {card()}
        </Card>
    );
};

export default withRouter(ItemCard);
