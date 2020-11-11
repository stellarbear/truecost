import * as React from 'react';
import {IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Carousel} from 'components/Carousel';
import {backend} from 'auxiliary/route';
import {Button} from '@material-ui/core';
import {Col} from 'pages/Base/Grid';
import ArrowBack from '@material-ui/icons/ArrowBack';
import {Link} from 'react-router-dom';

interface IProps {
    item: IItem;
    url: string
}

export const ItemImage: React.FC<IProps> = (props) => {
    const {item, url} = props;

    const {current: {shop}} = useStore();
    const {items} = shop();

    const image = (item: IItem) => `${backend.uri}/${item.id}/${item.images[0]}/u.png`;

    return (
        <div style={{position: "sticky", top: 70}}>
            <Col align="flex-start">
                <Button
                    component={Link}
                    to={`/${url}/shop`}
                    startIcon={< ArrowBack />}
                >
                    To the shop
                </Button>
                <Carousel alt={`${item.name}`}>
                    {[
                        image(item),
                        ...item.item.filter((id) => (id in items.id)).map((id) => image(items.id[id])),
                    ]}
                </Carousel>
            </Col>
        </div>
    );
};
