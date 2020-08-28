import * as React from 'react';
import {useState} from 'react';
import {IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {RowSwipable} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';

interface IProps {
    item: IItem;
}

const shuffle = (array: string[]) => {
    let counter = array.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;

        const temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
};

const getRelated = (items: Record<string, IItem>, ban: string) => {
    const all = shuffle(Object.keys(items).filter(e => e != ban));

    return all.slice(0, Math.min(all.length - 1, 8));
};

export const ItemRelated: React.FC<IProps> = (props) => {
    const {item: {id}} = props;
    const {current: {shop}} = useStore();
    const {items} = shop();

    const [related] = useState<string[]>(getRelated(items.id, id));

    return (
        <RowSwipable id="related-items" s={16} p={16} w={250} arrows>
            {related.map(id => <ItemCard key={id} id={id}/>)}
        </RowSwipable>
    );
};
