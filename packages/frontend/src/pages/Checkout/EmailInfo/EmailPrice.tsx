import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Button, CircularProgress, Typography} from '@material-ui/core';
import {CalcPrice} from '@truecost/shared';
import {ModalDialog} from 'components/ModalDialog';
import {TOS} from 'pages';
import {ApolloError} from '@apollo/client';
import {Alert} from '@material-ui/lab';
import {parseApolloError} from 'auxiliary/error';

interface IProps {
    error?: ApolloError;
    selected?: string;
    current?: string;
    loading: boolean;
}

export const EmailPrice: React.FC<IProps> = (props) => {
    const {current, selected, loading, error} = props;
    const {subs, current: {cart, shop}, currency} = useStore();

    const cartItems = cart();

    const [subscriptionPrice, subscriptionDiscount] = current
        ? [0, subs[current].discount]
        : selected
            ? [subs[selected].price, subs[selected].discount]
            : [0, 0];

    const adjustedSubscriptionPrice =
        CalcPrice.applyCurrency(subscriptionPrice, currency);

    const cartPrice = shop().getTotal(cartItems.local, currency, cartItems.global);
    const total = CalcPrice.round(CalcPrice.percentage(cartPrice.value, 100 - subscriptionDiscount) +
        adjustedSubscriptionPrice);

    return (
        <Col s={8} align="center" fullWidth>
            <Row align="center"
                style={{cursor: "pointer"}}>
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
                            <TOS key={0} />,
                        ]
                    }
                />
            </Row>
            <Button
                disabled={total === 0}
                style={{minHeight: 60}}
                variant="contained"
                color="primary"
                type="submit"
                fullWidth >
                {loading
                    ? <CircularProgress size={24} />
                    : (
                        <Row fullWidth justify="space-around">
                            <Typography variant="button" style={{fontSize: "1.4rem"}}>
                                {`Check out`}
                            </Typography>
                            <Typography variant="button" style={{fontSize: "1.4rem"}}>
                                <strong>
                                    {`${total} ${currency.label}`}
                                </strong>
                            </Typography>
                        </Row>
                    )
                }
            </Button>
            {error && (
                <Col style={{marginTop: 8}} fullWidth>
                    <Alert severity="error">{parseApolloError(error).asString()}</Alert>
                </Col>
            )}
            <Typography variant="caption"
                style={{
                    transition: "all 0.4s",
                    height: total === 0 ? 20 : 0,
                    opacity: total === 0 ? 1.0 : 0.0,
                }}>
                You need to add some goods or select a subscription
            </Typography>
            <Col align="flex-end" fullWidth>
                <Typography
                    variant="caption"
                    style={{opacity: subscriptionDiscount ? 1.0 : 0.4}}>
                    {`subscription discount: -${subscriptionDiscount} %`}
                </Typography>
                <Typography
                    variant="caption"
                    style={{opacity: adjustedSubscriptionPrice ? 1.0 : 0.4}}>
                    {`subscription price: +${adjustedSubscriptionPrice} ${currency.label}`}
                </Typography>
                <Typography variant="caption">{`subtotal: ${cartPrice.value} ${currency.label}`}</Typography>
                <Typography variant="caption">{`total: ${total} ${currency.label}`}</Typography>
            </Col>
        </Col >
    );
};
