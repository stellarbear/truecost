import * as React from 'react';
import {IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Carousel} from 'components/Carousel';
import {backend} from 'auxiliary/route';

interface IProps {
    item: IItem
}

export const ItemImage: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;

    const {current: {shop}} = useStore();
    const {items,} = shop();

    const image = (item: IItem) => `${backend.uri}/${item.id}/${item.images[0]}/u.png`;

    return (
        <Carousel>
            {[
                image(item),
                ...item.item.filter((id) => (id in items.id)).map((id) => image(items.id[id]))
            ]}
        </Carousel>
    )
}
