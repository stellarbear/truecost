import * as React from 'react';
import {Card, Hidden, Typography} from '@material-ui/core';
import {MasterCard, PayPal, Visa} from 'assets/cards';
import {Col, Row} from 'pages/Base/Grid';
import {colors} from 'theme';

export enum PaymentMethod {Stripe = "stripe", PayPal = "paypal"}

interface IProps {
    method: PaymentMethod;
    setMethod: (m: PaymentMethod) => void;
}

const scaleStripe = {
    width: 40, marginLeft: 40, marginTop: 35, marginRight: -20,
    transform: "scale(3.0)",
};
const scalePayPal = {
    width: 40, marginLeft: -30, marginTop: 20, marginRight: -20,
    transform: "scale(3.0)",
};

const options = [
    {
        method: PaymentMethod.Stripe, icon: (
            <Row align="center">
                <Hidden xsDown>
                    <Typography
                        style={{marginTop: -5, marginRight: 16}}
                        variant="caption">Preferred method</Typography>
                </Hidden>
                <Row>
                    <Visa style={scaleStripe} />
                    <MasterCard style={scaleStripe} />
                </Row>
            </Row>
        ),
    },
    {
        method: PaymentMethod.PayPal, icon: (
            <PayPal style={scalePayPal} />
        ),
    },
];

export const EmailMethod: React.FC<IProps> = (props) => {
    const {method: current, setMethod} = props;
    const [hovered, setHovered] = React.useState<PaymentMethod | null>(null);

    return (
        <>
            <Row>
                <Typography variant="caption">Payment method</Typography>
            </Row>
            <Row s={16} >
                {options.map(({method, icon}) => (
                    <Card
                        key={method}
                        raised={hovered === method}
                        style={{
                            height: 68,
                            width: 300, cursor: "pointer",
                            ...((current === method)
                                ? {
                                    color: "#fff",
                                    backgroundColor: colors.primaryColor,
                                } : {}),
                        }}
                        onMouseEnter={() => setHovered(method)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setMethod(method)}>
                        <Col p={[8, 16]} align="center">
                            {icon}
                        </Col>
                    </Card>
                ))}
            </Row>
        </>
    );
};