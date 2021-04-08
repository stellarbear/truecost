import * as React from 'react';
import {Card, Hidden, Typography} from '@material-ui/core';
import {Visa, MasterCard, PayPal} from 'assets/cards';
import {Col, Row} from 'pages/Base/Grid';
import {colors} from 'theme';

export enum PaymentMethod {Stripe = "stripe", PayPal = "paypal"}

interface IProps {
    method: PaymentMethod;
    setMethod: (m: PaymentMethod) => void;
}

const scaleStripe = {
    width: 40, marginLeft: 40, marginTop: 34, marginRight: -20,
    transform: "scale(2.8)",
};
const scalePayPal = {
    width: 40, marginLeft: -30, marginTop: 20, marginRight: -20,
    transform: "scale(3.0)",
};

const options = [
    // {
    //     method: PaymentMethod.Stripe, icon: (
    //         <>
    //             <Hidden smUp>
    //                 <Col align="center" style={{marginTop: -11}}>
    //                     <Row>
    //                         <Visa style={scaleStripe} />
    //                         <MasterCard style={scaleStripe} />
    //                     </Row>
    //                     <Typography
    //                         style={{marginTop: -11}}
    //                         variant="caption">And other cards</Typography>
    //                 </Col>
    //             </Hidden>
    //             <Hidden xsDown>
    //                 <Row align="center">
    //                     <Row>
    //                         <Visa style={scaleStripe} />
    //                         <MasterCard style={scaleStripe} />
    //                     </Row>
    //                     <Typography
    //                         style={{
    //                             marginTop: -4,
    //                             marginLeft: 40,
    //                         }}
    //                         variant="caption">And other cards</Typography>
    //                 </Row>
    //             </Hidden>
    //         </>
    //     ),
    // },
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
                                    backgroundColor: "#fff"//colors.primaryColor,
                                } : {}),
                        }}
                        //onMouseEnter={() => setHovered(method)}
                        //onMouseLeave={() => setHovered(null)}
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