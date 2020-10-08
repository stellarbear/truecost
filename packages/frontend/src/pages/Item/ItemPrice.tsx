import * as React from 'react';
import {CalcResult, IItem} from "@truecost/shared";
import {Typography} from '@material-ui/core';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';
import {ItemDivider} from './ItemDivider';

interface IProps {
    item: IItem;
    price: CalcResult;
}

export const ItemPrice: React.FC<IProps> = (props) => {
    const {item, price} = props;

    return (
        <>
            <Row s={24} align="center" justify="flex-end">
                <Typography variant="body1">{"Base price"}</Typography>
                <PriceTypography price={price.value}
                                 discount={item.discount}/>
            </Row>
            <ItemDivider/>
        </>
    );
};
