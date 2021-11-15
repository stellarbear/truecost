import * as React from "react";
import {Row} from "pages/Base/Grid";
import {Bitcoin, PayPal} from "assets/cards";

const additional = [
    PayPal,
    Bitcoin,
];

export const FooterAdditionalPayment: React.FC = () => {
    return (
        <Row
            justify="center" wrap
            style={{backgroundColor: "#E0E0E0", overflow: "hidden", cursor: "pointer"}} >
            {additional.map((e, i) => React.createElement(e, {
                style: {
                    margin: "24px 32px 0px",
                    transform: "scale(3.0)",
                },
                key: i,
            }))}
        </Row>
    );
};
