import * as React from 'react';
import {CalcResult, IItem} from "@truecost/shared";
import {useStore} from 'pages/Data/Wrapper';
import {Button, Typography} from '@material-ui/core';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';
import {AddToCartDialog} from 'pages/Base/AddToCartDialog';

interface IProps {
    url: string;
    item: IItem;
    price: CalcResult;
    options: string[];
    chunk: [number, number];
}

export const ItemAddToCard: React.FC<IProps> = (props) => {
    const {item, price} = props;
    const {update: {cart}} = useStore();
    const noLimit = cart.count({itemId: item.id}) < (item.limit || Infinity);

    return (
        <AddToCartDialog 
            {...props}
            button={
                <Button
                    fullWidth
                    size="large"
                    color={noLimit ? "primary" : "default"}
                    variant="contained"
                    startIcon={noLimit
                        ? <AddShoppingCart />
                        : <CheckCircle />}
                >
                    <Row justify="space-between" align="center" fullWidth>
                        <Typography variant="caption">{noLimit ? "add to cart" : "item in your cart"}</Typography>
                        <PriceTypography price={price.value}
                            discount={item.discount} />
                    </Row>
                </Button>
            }
        />
    );
};
