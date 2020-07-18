import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox} from '@material-ui/core';
import Markdown from 'components/Markdown';
import {useState} from 'react';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';

interface IProps {
    item: IItem
    price: Price
}

export const ItemPrice: React.FC<IProps> = (props) => {
    const {item, price} = props;

    return (
        <Row s={64} end p={[4, 32]}>
            <Typography variant="body1">{"Base price"}</Typography>
            <PriceTypography price={price.toValue}
                discount={item.discount} />
        </Row>
    )
}