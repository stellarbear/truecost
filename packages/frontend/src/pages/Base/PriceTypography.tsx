import * as React from "react";
import {Typography} from "@material-ui/core";


interface IPriceTypoProps {
    price: number;
    discount: number;
}

export const PriceTypography: React.FC<IPriceTypoProps> = ({price, discount}): JSX.Element => {

    const renderNormal = () => (
        <Typography variant="h6" color="inherit">
            {`${price} $`}
        </Typography>
    )

    const renderWithDiscount = () => (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography variant="h6" color="inherit">
                {`${price} $`}
            </Typography>
            <Typography color="inherit"
                style={{
                    textDecoration: "line-through",
                    opacity: 0.5,
                    marginTop: -4,
                    fontSize: "0.8rem",
                }}>
                {`${price + discount} $`}
            </Typography>
        </div>
    )

    if (discount === 0) {
        return renderNormal();
    } else {
        return renderWithDiscount();
    }
};