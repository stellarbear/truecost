import * as React from "react";
import {TypographyTwoLevel} from "./TypographyTwoLevel";


interface IPriceTypoProps {
    price: number;
    discount: number;
}

export const PriceTypography: React.FC<IPriceTypoProps> = ({price, discount}) => (
    <TypographyTwoLevel
    styleDown={{textDecoration: "line-through"}}
        text={`${price} $`}
        description={discount === 0 ? undefined : `${price + discount} $`}
    />
); 