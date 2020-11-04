import * as React from 'react';
import {IItem, CalcPrice} from "@truecost/shared";
import {Button, Grid, NoSsr} from '@material-ui/core';
import {ItemImage} from './ItemImage';
import {ItemDescription} from './ItemDescription';
import {ItemChildren} from './ItemChildren';
import {ItemObtain} from './ItemObtain';
import {ItemRange} from './ItemRange';
import {ItemRequirements} from './ItemRequirements';
import {ItemOption} from './ItemOption';
import {ItemAddToCard} from './ItemAddToCard';
import {ItemRelated} from './ItemRelated';

import ArrowDownward from '@material-ui/icons/ArrowDownward';
import ArrowBack from '@material-ui/icons/ArrowBack';
import {Link} from 'react-router-dom';
import {useStore} from 'pages/Data/Wrapper';
import {ItemEta} from './ItemEta';
import {HowToUse} from 'pages/Base/HowToUse';
import {PersonalDiscount} from 'pages/Base/PersonalDiscount';
import {ItemOrdered} from './ItemOrdered';

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

    const itemPrice = CalcPrice.fromItem(item, chunk);
    const totalPrice = CalcPrice.fromItemAndOptions(itemPrice, selectedOptions.map(o => options.local.id[o]));

    return (
        <div>
            <Button
                component={Link}
                to={`/${url}/shop`}
                startIcon={< ArrowBack />}
            >
                To the shop
            </Button>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <ItemImage item={item} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <ItemDescription item={item} />
                    <ItemOrdered item={item} />
                    <ItemChildren item={item} />
                    <ItemObtain item={item} />
                    <ItemRequirements item={item} />
                    <NoSsr>
                        <ItemRange item={item} chunk={chunk} onChange={setChunk} />
                        <ItemOption price={itemPrice} item={item}
                            selected={selectedOptions}
                            onChange={(val: string[]) => setSelectedOptions(val)} />
                    </NoSsr>
                    <ItemEta item={item} chunk={chunk} />
                    <ItemAddToCard
                        url={url}
                        price={totalPrice} item={item} chunk={chunk}
                        options={selectedOptions}
                    />
                </Grid>
            </Grid>
            <Button startIcon={< ArrowDownward />}
                style={{pointerEvents: "none"}}>
                Related goods
            </Button>
            <NoSsr>
                <ItemRelated item={item} />
            </NoSsr>
            <PersonalDiscount />
            <Button startIcon={< ArrowDownward />} style={{marginTop: 16}}>
                How to use our service
            </Button>
            <HowToUse />
        </div>
    );
};
