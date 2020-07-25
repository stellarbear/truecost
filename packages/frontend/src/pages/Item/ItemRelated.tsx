import * as React from 'react';
import {IItem} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Col, Row, RowSwipable} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';
import {useState} from 'react';

interface IProps {
    item: IItem
}

const getRelated = (items: Record<string, IItem>) => {
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
    //const {item} = props;
    const {current: {shop}} = React.useContext(DataContext);
    const {items, } = shop();

    const [related] = useState<string[]>(getRelated(items.id))

    return (
        <RowSwipable s={16} p={16} w={250}>
            {related.map(id => <ItemCard key={id} id={id} />)}
        </RowSwipable>
    )
}
