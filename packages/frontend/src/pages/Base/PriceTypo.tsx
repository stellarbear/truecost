import React from "react";
import {Typography} from "@material-ui/core";


interface IPriceTypoProps {
    price: number;
    priceWithDiscount: number;
}

const PriceTypo: React.FC<IPriceTypoProps> = ({price, priceWithDiscount}): JSX.Element => {

    return (
        <React.Fragment>
            {
                price === priceWithDiscount
                    ? (
                        <Typography variant="h6" color="inherit">
                            {`${price} $`}
                        </Typography>
                    )
                    : (
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
                                {`${priceWithDiscount} $`}
                            </Typography>
                        </div>
                    )
            }
        </React.Fragment>
    );
};

export default PriceTypo;
