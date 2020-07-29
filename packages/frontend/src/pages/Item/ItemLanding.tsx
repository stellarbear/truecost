import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {Container, Button, Grid} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';
import {ItemImage} from './ItemImage';
import {ItemDescription} from './ItemDescription';
import {ItemDivider} from './ItemDivider';
import {ItemTag} from './ItemTag';
import {ItemChildren} from './ItemChildren';
import {ItemObtain} from './ItemObtain';
import {ItemRange} from './ItemRange';
import {ItemRequirements} from './ItemRequirements';
import {ItemPrice} from './ItemPrice';
import {ItemOption} from './ItemOption';
import {ItemAddToCard} from './ItemAddToCard';
import {ItemRelated} from './ItemRelated';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {Link} from 'react-router-dom';
import {DataContext, useStore} from 'pages/Data/Wrapper';

interface IProps {
    item: IItem
}

export const ItemLanding: React.FC<IProps> = (props) => {
    const {item} = props
    const itemId = item.id;

    const {current: {shop, game: {url}}} = useStore();
    const {options, } = shop();

    const [chunk, setChunk] = React.useState<[number, number]>(item.range.length > 0
        ? [item.range.first().at, item.range.last().at] : [0, 0])
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([])

    const price = Price.fromItem(item, chunk);
    const total = price.withOption(selectedOptions.map(o => options.local.id[o]));

    return (
        <Container fixed>
            <Button
                component={Link}
                to={`/${url}/shop`}
                startIcon={< ArrowBackIcon />}
            >
                To the shop
            </Button>
            <Grid container>
                <Grid item xs={12} lg={6}>
                    <ItemImage item={item} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <ItemDescription item={item} />
                    <ItemTag item={item} />
                    <ItemChildren item={item} />
                    <ItemObtain item={item} />
                    <ItemRequirements item={item} />
                    <ItemRange item={item} chunk={chunk} onChange={setChunk} />
                    <ItemPrice price={price} item={item} />
                    <ItemOption price={price} item={item}
                        selected={selectedOptions}
                        onChange={(val: string[]) => setSelectedOptions(val)} />
                    <ItemAddToCard
                        price={total} item={item} chunk={chunk}
                        options={selectedOptions}
                    />
                </Grid>
            </Grid>
            <Button startIcon={< ArrowDownwardIcon />} >
                Related goods
            </Button>
            <ItemRelated item={item} />
        </Container>
    )
}
