import * as React from "react";
import {Row} from "pages/Base/Grid";
import {Visa, MasterCard, Discover, JCB, UnionPay, Amex, Diners} from "assets/cards";

const payment = [
    Visa,
    MasterCard,
    Discover,
    JCB,
    UnionPay,
    Amex,
    Diners,
];
export const FooterPayment: React.FC = () => (
    <Row
        justify="center" wrap
        style={{backgroundColor: "#E0E0E0", overflow: "hidden"}} >
        {payment.map((e, i) => React.createElement(e, {
            style: {
                width: 40, marginLeft: 40, marginTop: 40, marginRight: -20,
                transform: "scale(3.0)",
            },
            key: i,
        }))}
    </Row>
);