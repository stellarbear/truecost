import * as React from 'react';
import {IItem} from "@truecost/shared";
import Carousel from 'components/Carousel';
import {baseUri} from 'auxiliary/route';
import {DataContext} from 'pages/Data/Wrapper';

interface IProps {
    item: IItem
}

export const ItemImage: React.FC<IProps> = (props) => {
    const {item} = props;
    const itemId = item.id;
    
    const {current: {shop}} = React.useContext(DataContext);
    const {items, } = shop();

    const image = (item: IItem) => `${baseUri}/${item.id}/${item.images[0]}/u.png`;

    return (
        <Carousel arrows={false} >
            <img style={{objectFit: "cover", }} src={image(item)} />
            {item.item.map((id) => (id in items.id) && (
                <img key={`${itemId}-${id}`} style={{objectFit: "cover", }} src={image(items.id[id])} />
            ))}
        </Carousel>
    )
}