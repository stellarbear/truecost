import * as React from 'react'
import {Price} from '@truecost/shared'
import {Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';

interface IProps {
    total: Price
}

export const ItemTotal: React.FC<IProps> = ({total}) => {
    const {current: {shop, cart}} = useStore();

    const cartItems = cart();
    const {items: {id: items}} = shop();

    const base = shop().getTotal(cartItems.local);
    const extra = shop().getExtra(base, cartItems.global);
    const subtotal = base.add(extra);

    const discount = Object.keys(cartItems.local).reduce((acc, cur) => acc + items[cur].discount, 0);

    return (
        <Row end s={16}>
            <Typography>subtotal:</Typography>
            <PriceTypography
                price={subtotal.toValue}
                discount={discount}
            />
        </Row>
    )
}