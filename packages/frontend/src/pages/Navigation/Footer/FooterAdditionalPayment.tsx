import * as React from "react";
import {Row} from "pages/Base/Grid";
import {Bitcoin, Paypal} from "assets/cards";
import {useNotification} from "components/wrappers/NotifyWrapper";

const additional = [
    Paypal,
    Bitcoin,
];

export const FooterAdditionalPayment: React.FC = () => {
    const {notify} = useNotification();
    return (
        <Row
            onClick={() => notify("Contact us for paypal/bitcoin payments")}
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