import * as React from 'react';
import {IItem} from "@truecost/shared";
import {serverUri} from 'auxiliary/route';
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Carousel} from 'components/Carousel';

interface IProps {
    item: IItem
}

export const ItemImage: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;

    const {current: {shop}} = useStore();
    const {items,} = shop();

    const image = (item: IItem) => `${serverUri}/${item.id}/${item.images[0]}/u.png`;

    return (
        <Carousel>
            {[
                image(item),
                ...item.item.filter((id) => (id in items.id)).map((id) => image(items.id[id]))
            ]}
        </Carousel>
    )
}
