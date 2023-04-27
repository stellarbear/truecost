import * as React from 'react';
import {Card, Hidden, Typography, Button} from '@material-ui/core';
import {Visa, MasterCard, PayPal} from 'assets/cards';
import {Col, Row} from 'pages/Base/Grid';
import {ModalDialog} from 'components/ModalDialog';
import {colors} from 'theme';
import {social} from "auxiliary/social";
import SocialDialog from "pages/Base/SocialDialog";

export enum PaymentMethod {Stripe = "stripe", PayPal = "paypal"}

declare let Tawk_API: any;

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
    {
        method: PaymentMethod.Stripe, icon: (
            <>
                <Hidden smUp>
                    <Col align="center" style={{marginTop: -11}}>
                        <Row>
                            <Visa style={scaleStripe} />
                            <MasterCard style={scaleStripe} />
                        </Row>
                        <Typography
                            style={{marginTop: -11}}
                            variant="caption">And other cards</Typography>
                    </Col>
                </Hidden>
                <Hidden xsDown>
                    <Row align="center">
                        <Row>
                            <Visa style={scaleStripe} />
                            <MasterCard style={scaleStripe} />
                        </Row>
                        <Typography
                            style={{
                                marginTop: -4,
                                marginLeft: 40,
                            }}
                            variant="caption">And other cards</Typography>
                    </Row>
                </Hidden>
            </>
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
            <ModalDialog
                button={
                    <Typography variant="h6" style={{textDecoration: "underline", cursor: "pointer", color: "red"}}>
                        To place an order, please contact us in any way convenient for you.
                    </Typography>
                }
                content={
                    [
                        <Col key="0" s={8}>
                            <div />
                            <Typography>To place an order, please contact us in any way convenient for you.</Typography>
                            <div style={{
                                display: "flex", flexWrap: "wrap", justifyContent: "space-evenly",
                            }}>
                                {
                                    social.map((item, index) => (
                                        <div key={`social-${index}`} style={{
                                            display: "flex", flexDirection: "column", alignItems: "center",
                                        }}>
                                            <SocialDialog key={`social-${index}`} button={
                                                (
                                                    <Button variant="contained" size="medium">
                                                        {React.cloneElement(item.icon, {
                                                            style: { padding: "8px 0",
                                                                transition: "all 0.2s linear",
                                                            },
                                                        })}
                                                    </Button>
                                                )
                                            } {...item} />

                                            <Typography style={{
                                                color: hovered === item.title ? colors.primaryColor : "black",
                                                transition: "all 0.2s linear",
                                            }}>{item.title}</Typography>
                                        </div>
                                    ))
                                }
                            </div>
                            <Button
                                variant="contained" color="primary"
                                onClick={() => Tawk_API?.maximize()}>
                                send us a message via live chat
                            </Button>
                        </Col>
                    ]
                }
            />
        </>
    );
};
