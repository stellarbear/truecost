import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {Container} from '@material-ui/core';

import {useStore} from 'pages/Data/Wrapper';
import {ItemDescription} from 'pages/Item/ItemDescription';
import {ItemChildren} from 'pages/Item/ItemChildren';
import {ItemObtain} from 'pages/Item/ItemObtain';
import {ItemRequirements} from 'pages/Item/ItemRequirements';
import {ItemRange} from 'pages/Item/ItemRange';
import {ItemPrice} from 'pages/Item/ItemPrice';
import {ItemOption} from 'pages/Item/ItemOption';
import {ItemEta} from 'pages/Item/ItemEta';
import {ItemAddToCard} from 'pages/Item/ItemAddToCard';
import {Col} from 'pages/Base/Grid';

interface IProps {
    item: IItem;
}

export const HomeItemLanding: React.FC<IProps> = (props) => {
    const {item} = props;
    const {current: {shop}} = useStore();
    const {options} = shop();

    const [chunk, setChunk] = React.useState<[number, number]>(item.range.d.length > 0
        ? [item.range.d.first().a, item.range.d.last().a] : [0, 0]);
    const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

    const price = Price.fromItem(item, chunk);
    const total = price.withOption(selectedOptions.map(o => options.local.id[o]));

    return (
        <Container maxWidth="sm">
            <Col s={8} p={[8, 0]} fullWidth>
                <ItemDescription item={item} />
                <ItemChildren item={item} />
                <ItemObtain item={item} />
                <ItemRequirements item={item} />
                <ItemRange item={item} chunk={chunk} onChange={setChunk} />
                <ItemPrice price={price} item={item} />
                <ItemOption price={price} item={item}
                    selected={selectedOptions}
                    onChange={(val: string[]) => setSelectedOptions(val)} />
                <ItemEta item={item} chunk={chunk} />
                <ItemAddToCard
                    price={total} item={item} chunk={chunk}
                    options={selectedOptions}
                />
            </Col>
        </Container>
    );
};
