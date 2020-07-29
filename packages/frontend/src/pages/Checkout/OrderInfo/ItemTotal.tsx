import * as React from 'react'
import {Price} from '@truecost/shared'
import {Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';

interface IProps {
    total: Price
    selected: string[]
}

export const ItemTotal: React.FC<IProps> = ({total, selected}) => {
    const {current: {shop, cart}} = useStore();

    const cartItems = cart();
    const {options: {global: {id: global}}, items: {id: items}} = shop();

    const discount = Object.keys(cartItems).reduce((acc, cur) => acc + items[cur].discount, 0);
    const price = total.withOption(selected.map(s => global[s]));
    return (
        <Row end s={16}>
            <Typography>subtotal:</Typography>
            <PriceTypography
                price={price.toValue}
                discount={discount}
            />
        </Row>
    )
}