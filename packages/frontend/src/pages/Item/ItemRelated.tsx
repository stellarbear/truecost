import * as React from 'react';
import {useState} from 'react';
import {IItem, shuffle} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Col, RowGrid} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';

interface IProps {
    item: IItem;
}

const getRelated = (items: Record<string, IItem>, ban: string) => {
    const all = shuffle(Object.keys(items).filter(e => e != ban && !items[e].direct));

    return all.slice(0, Math.min(all.length - 1, 8));
};

export const ItemRelated: React.FC<IProps> = (props) => {
    const {item: {id}} = props;
    const {current: {shop}} = useStore();
    const {items} = shop();

    const [related, setRelated] = useState<string[]>([]);
    React.useEffect(() => setRelated(getRelated(items.id, id)), [id]);

    return (
        <Col p={[16, 0]}>
            <RowGrid w={250} s={16} p={16}>
                {related.map(id => <ItemCard key={id} id={id} />)}
            </RowGrid>
        </Col>
    );
};
