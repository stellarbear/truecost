import * as React from 'react';
import {Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';
import {CalcPrice, CalcResult} from '@truecost/shared';

interface IProps {
    total: CalcResult;
}

export const ItemTotal: React.FC<IProps> = (props) => {
    const {total} = props;
    const {current: {shop, cart}} = useStore();

    const cartItems = cart();
    const {items: {id: items}, options: {global: {id: global}}} = shop();

    const totalPrice = CalcPrice.fromItemAndOptions(total,cartItems.global.map(o => global[o]));
    const discount = Object.keys(cartItems.local).reduce((acc, cur) => acc + items[cur].discount, 0);

    return (
        <>
            <Typography variant="caption">Price with final discount at step #3</Typography>
            <Row end s={16}>
                <Typography>subtotal:</Typography>
                <PriceTypography
                    price={totalPrice.value}
                    discount={discount}
                />
            </Row>
        </>
    );
};
