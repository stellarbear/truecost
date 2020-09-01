import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Button, Divider, Typography, CircularProgress} from '@material-ui/core';
import {useNotification} from 'components/wrappers/NotifyWrapper';
import {CalcPrice} from '@truecost/shared';

interface IProps {
    selected?: string;
    current?: string;
    agree: boolean;
    loading: boolean;
}

export const EmailPrice: React.FC<IProps> = (props) => {
    const {notify} = useNotification();
    const {current, selected, agree, loading} = props;
    const {subs, current: {cart, shop}} = useStore();

    const cartItems = cart();

    const [subscriptionPrice, subscriptionDiscount] = current
        ? [0, subs[current].discount]
        : selected
            ? [subs[selected].price, subs[selected].discount]
            : [0, 0];

    const cartPrice = shop().getTotal(cartItems.local, cartItems.global);
    const total = CalcPrice.percentage(cartPrice.value + subscriptionPrice, 100 - subscriptionDiscount);

    return (
        <Col right s={8}>
            <Col right>
                <Typography variant="caption">{`subtotal: ${cartPrice.value} $`}</Typography>
                <Typography
                    variant="caption"
                    style={{opacity: subscriptionPrice ? 1.0 : 0.4}}>
                    {`subscription price: +${subscriptionPrice} $`}
                </Typography>
                <Typography
                    variant="caption"
                    style={{opacity: subscriptionDiscount ? 1.0 : 0.4}}>
                    {`subscription discount: -${subscriptionDiscount} %`}
                </Typography>
            </Col>
            <Divider />
            <Row end>
                <div
                    onClick={() => !agree && notify("Agree to TOS first")}>
                    <Button disabled={!agree} variant="contained" type="submit">
                        {loading ? <CircularProgress size={24} /> : `Total: ${total} $`}
                    </Button>
                </div>
            </Row>
        </Col>
    );
};
