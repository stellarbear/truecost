import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {Button, Container, Grid} from '@material-ui/core';
import {ItemImage} from './ItemImage';
import {ItemDescription} from './ItemDescription';
import {ItemTag} from './ItemTag';
import {ItemChildren} from './ItemChildren';
import {ItemObtain} from './ItemObtain';
import {ItemRange} from './ItemRange';
import {ItemRequirements} from './ItemRequirements';
import {ItemPrice} from './ItemPrice';
import {ItemOption} from './ItemOption';
import {ItemAddToCard} from './ItemAddToCard';
import {ItemRelated} from './ItemRelated';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import {Link} from 'react-router-dom';
import {useStore} from 'pages/Data/Wrapper';
import {ItemEta} from './ItemEta';

interface IProps {
    item: IItem;
}

export const ItemLanding: React.FC<IProps> = (props) => {
    const {item} = props;
    const {current: {shop, game: {url}}} = useStore();
    const {options} = shop();

    const [chunk, setChunk] = React.useState<[number, number]>(item.range.d.length > 0
        ? [item.range.d.first().a, item.range.d.last().a] : [0, 0]);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const price = Price.fromItem(item, chunk);
    const total = price.withOption(selectedOptions.map(o => options.local.id[o]));

    return (
        <Container fixed>
            <Button
                component={Link}
                to={`/${url}/shop`}
                startIcon={< ArrowBack/>}
            >
                To the shop
            </Button>
            <Grid container>
                <Grid item xs={12} lg={6}>
                    <ItemImage item={item}/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <ItemDescription item={item}/>
                    <ItemTag item={item} chunk={chunk}/>
                    <ItemChildren item={item}/>
                    <ItemObtain item={item}/>
                    <ItemRequirements item={item}/>
                    <ItemRange item={item} chunk={chunk} onChange={setChunk}/>
                    <ItemPrice price={price} item={item}/>
                    <ItemOption price={price} item={item}
                                selected={selectedOptions}
                                onChange={(val: string[]) => setSelectedOptions(val)}/>
                    <ItemEta item={item} chunk={chunk}/>
                    <ItemAddToCard
                        price={total} item={item} chunk={chunk}
                        options={selectedOptions}
                    />
                </Grid>
            </Grid>
            <Button startIcon={< ArrowDownward/>}>
                Related goods
            </Button>
            <ItemRelated item={item}/>
        </Container>
    );
};
