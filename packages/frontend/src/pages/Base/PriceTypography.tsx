import {useStore} from "pages/Data/Wrapper";
import * as React from "react";
import {TypographyTwoLevel} from "./TypographyTwoLevel";


interface IPriceTypoProps {
    price: number;
    discount?: number;
}

export const PriceTypography: React.FC<IPriceTypoProps> = ({price, discount = 0}) => {
    const {currency} = useStore();
    return (
        <TypographyTwoLevel
            styleDown={{textDecoration: "line-through"}}
            text={`${price} ${currency.label}`}
            description={discount === 0
                ? undefined
                : `${price + discount} ${currency.label}`}
        />
    );
};
