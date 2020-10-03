import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Button, CircularProgress, Divider, Typography} from '@material-ui/core';
import {CalcPrice} from '@truecost/shared';
import {ModalDialog} from 'components/ModalDialog';
import {TOS} from 'pages';

interface IProps {
    selected?: string;
    current?: string;
    loading: boolean;
}

export const EmailPrice: React.FC<IProps> = (props) => {
    const {current, selected, loading} = props;
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
            <Divider/>
            <Row>
                <Typography variant="caption" color="secondary">
                    {`You agree with\u00A0`}
                </Typography>
                <ModalDialog
                    button={
                        <Typography variant="caption" style={{textDecoration: "underline"}}>
                            Terms of use
                        </Typography>
                    }
                    content={
                        [
                            <TOS key={0}/>,
                        ]
                    }
                />
            </Row>
            <Row end>
                <Button variant="contained" type="submit" color="primary">
                    {loading ? <CircularProgress size={24}/> : `Total: ${total} $`}
                </Button>
            </Row>
        </Col>
    );
};
