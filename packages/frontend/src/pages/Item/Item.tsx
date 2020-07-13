import React, {useEffect, useContext} from "react";
import {Typography, Chip, Button, Divider, Card, TextField, Hidden, createStyles, FormControl, InputLabel, Select, MenuItem, IconButton, Table, TableBody, TableRow, TableCell, FormControlLabel, Checkbox, Grid, makeStyles, Theme, Slider, Container} from "@material-ui/core";
import {ArrowBack, ArrowLeft, ArrowRight, ArrowForward, Info} from "@material-ui/icons";
import {useParams, Redirect} from "react-router-dom";
import Carousel from "components/Carousel";
import {Link} from 'react-router-dom'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import LinkIcon from '@material-ui/icons/Link';
import ItemRow from "pages/Base/ItemRow";

import {text} from "assets/text";
import {NotificationContext} from "components/wrappers";
import {DataContext} from "pages/Data/Wrapper";
import {ItemImage} from "./ItemImage";
import {ItemTag} from "./ItemTag";
import {ItemDescription} from "./ItemDescription";
import {ItemDivider} from "./ItemDivider";
import {ItemRequirements} from "./ItemRequirements";
import {ItemObtain} from "./ItemObtain";
import {ItemChildren} from "./ItemChildren";
import {Price} from "@truecost/shared";
import {ItemOption} from "./ItemOption";
import {ItemPrice} from "./ItemPrice";
import {Col} from "pages/Base/Grid";
import {ItemAddToCard} from "./ItemAddToCard";
import {ItemRelated} from "./ItemRelated";



export const Item: React.FC = () => {
    const {url: itemUrl} = useParams();
    const {current: {shop, game: {url}}} = useContext(DataContext);
    const {
        tags,
        items,
        options,
        categories,
        cart
    } = shop();

    const [selected, setSelected] = React.useState<string[]>([])

    if (itemUrl === undefined || !(itemUrl in items.url)) {
        return <Redirect to="/404" />;
    }

    const itemId = items.url[itemUrl];
    const item = items.id[itemId];

    const price = Price.fromItem(item);
    const total = price.withOption(selected.map(o => options.local[o]));

    return (
        <Container maxWidth="lg">
            <Col spacing={2}>
                <Button
                    component={Link}
                    to={`/${url}/shop`}
                    startIcon={< ArrowBack />}
                >
                    To the shop
                </Button>
                <Grid container>
                    <Grid item xs={12} md={12} lg={6}>
                        <ItemImage item={item} />
                    </Grid>
                    <Grid item xs={12} md={12} lg={6}>
                        <ItemDescription item={item} />
                        <ItemDivider item={item} prop="tag" />
                        <ItemTag item={item} />
                        <ItemDivider item={item} prop="item" />
                        <ItemChildren item={item} />
                        <ItemDivider item={item} prop="obtain" />
                        <ItemObtain item={item} />
                        <ItemDivider item={item} prop="requirements" />
                        <ItemRequirements item={item} />
                        <ItemDivider />
                        <ItemPrice price={total} item={item} />
                        <ItemDivider />
                        <ItemOption price={price} item={item}
                            selected={selected}
                            onChange={(val: string[]) => setSelected(val)} />
                        <ItemDivider />
                        <ItemAddToCard
                            price={total} item={item}
                            options={selected}
                        />
                    </Grid>
                </Grid>
                <Button
                    startIcon={< ArrowDownwardIcon />}
                >
                    Related goods
            </Button>
                <Grid container>
                    <ItemRelated item={item} />
                </Grid>
            </Col>
        </Container>
    );
}