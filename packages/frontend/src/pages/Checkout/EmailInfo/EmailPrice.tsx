import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Typography, Divider, Button} from '@material-ui/core';

interface IProps {
    selected?: string
    current?: string
}

export const EmailPrice: React.FC<IProps> = (props) => {
    const {current, selected} = props;
    const {subs, current: {cart, shop}} = useStore();

    const cartItems = cart();

    const [subscriptionPrice, subscriptionDiscount] = current
        ? [0, subs[current].discount]
        : selected
            ? [subs[selected].price, subs[selected].discount]
            : [0, 0];

    const base = shop().getTotal(cartItems.local);
    const discount = shop().getTotal(cartItems.local, subscriptionDiscount);

    const extra = shop().getExtra(base, cartItems.global, subscriptionDiscount);
    const subtotal = discount.add(extra);

    const total = subtotal.add(subscriptionPrice);

    return (
        <Col right s={8}>
            <Col right>
                <Typography variant="caption">{`subtotal: ${subtotal.toValue} $`}</Typography>
                <Typography variant="caption" style={{opacity: subscriptionPrice ? 1.0 : 0.4}}>{`subscription price: +${subscriptionPrice} $`}</Typography>
                <Typography variant="caption" style={{opacity: subscriptionDiscount ? 1.0 : 0.4}}>{`subscription discount: -${subscriptionDiscount} %`}</Typography>
            </Col>
            <Divider />
            <Row end>
                <Button variant="contained" type="submit">{`Total: ${total.toValue} $`}</Button>
            </Row>
        </Col>
    )
}