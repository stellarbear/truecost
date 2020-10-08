import * as React from 'react';
import {Typography} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row, Col} from 'pages/Base/Grid';
import {CalcPrice, CalcResult} from '@truecost/shared';

interface IProps {
    total: CalcResult;
}

export const ItemTotal: React.FC<IProps> = (props) => {
    const {total} = props;
    const {current: {shop, cart}} = useStore();

    const cartItems = cart();
    const {items: {id: items}, options: {global: {id: global}}} = shop();

    const totalPrice = CalcPrice.fromItemAndOptions(total, cartItems.global.map(o => global[o]));
    const discount = Object.keys(cartItems.local).reduce((acc, cur) => acc + items[cur].discount, 0);

    return (
        <>
            <Row justify="space-between" s={16} m={[0, 16]}>
                <Col style={{marginLeft: -16}}>
                    <Typography variant="caption">Total price</Typography>
                    <Typography variant="caption">Discounts will be applied on the last (#3) step</Typography>
                </Col>
                <PriceTypography
                    price={totalPrice.value}
                    discount={discount}
                />
            </Row>
        </>
    );
};
