import * as React from "react";
import {Typography} from "@material-ui/core";
import {Col} from "./Grid";
import {CSSProperties} from "react";


interface IPriceTypoProps {
    price: number;
    discount: number;
}

export const PriceTypography: React.FC<IPriceTypoProps> = ({price, discount}) => {
    const renderNormal = () => (
        <Typography variant="h6" color="inherit" noWrap>
            {`${price} $`}
        </Typography>
    )

    const renderWithDiscount = () => (
        <Col m={[-8, 0]}>
            <Typography variant="h6" color="inherit" noWrap>
                {`${price} $`}
            </Typography>
            <Typography color="inherit" noWrap
                        style={{
                            textDecoration: "line-through",
                            opacity: 0.5,
                            marginTop: -4,
                            fontSize: "0.8rem",
                        }}>
                {`${price + discount} $`}
            </Typography>
        </Col>
    )

    return (
        discount === 0
            ? renderNormal()
            : renderWithDiscount()
    )
};
