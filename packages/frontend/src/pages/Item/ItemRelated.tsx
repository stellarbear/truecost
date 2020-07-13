import * as React from 'react';
import {IItem} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import {Col} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';

interface IProps {
    item: IItem
}

const useRelated = (items: Record<string, IItem>) => {
    const all = Object.keys(items);

    const related: string[] = [];

    const limit = Math.min(all.length - 1, 8)
    for (let i = 0; i < Math.min(limit, 8); i++) {
        const index = Math.round(Math.random() * (limit - 1));
        const newItem = all[index];

        if (related.includes(newItem)) {
            i--;
        } else {
            related.push(newItem)
        }
    }

    return related;
}

export const ItemRelated: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id

    const {current: {shop, game: {url}}} = React.useContext(DataContext);
    const {items, } = shop();

    const related = useRelated(items.id);

    return (
        <Col left>
            {related.length > 0 && (
                related.map(id => <ItemCard key={id} id={id} />)
            )}
        </Col>
    )
}