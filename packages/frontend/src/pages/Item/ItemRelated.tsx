import * as React from 'react';
import {IItem} from "@truecost/shared";
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Col, Row, RowSwipable} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';
import {useState} from 'react';

interface IProps {
    item: IItem
}

const getRelated = (items: Record<string, IItem>, ban: string) => {
    const all = Object.keys(items).filter(e => e != ban);

    const related: string[] = [];

    const limit = Math.min(all.length - 1, 8)

    if (limit <= 8) {
        return all;
    }

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

export const ItemRelated: React.FC<IProps> = ({item: {id}}) => {
    //const {item} = props;
    const {current: {shop}} = useStore();
    const {items, } = shop();

    const [related] = useState<string[]>(getRelated(items.id, id))

    return (
        <RowSwipable id="related-items" s={16} p={16} w={250} arrows>
            {related.map(id => <ItemCard key={id} id={id} />)}
        </RowSwipable>
    )
}
