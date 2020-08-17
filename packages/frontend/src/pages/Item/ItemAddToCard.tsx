import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox, Button} from '@material-ui/core';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import CheckCircle from '@material-ui/icons/CheckCircle';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';
import {NotificationContext} from 'components/wrappers';
import {useContext} from 'react';
import {useNotification} from 'components/wrappers/NotifyWrapper';

interface IProps {
    item: IItem
    price: Price
    options: string[]
    chunk: [number, number]
}

export const ItemAddToCard: React.FC<IProps> = (props) => {
    const {item, options, price, chunk} = props;
    const itemId = item.id

    const {notify} = useNotification()
    const {update: {cart}} = useStore();

    const noLimit = cart.count({itemId: item.id}) < (item.limit || Infinity);

    return (
        <Button
            fullWidth
            size="large"
            color={noLimit ? "primary" : "default"}
            variant="contained"
            startIcon={noLimit ? <AddShoppingCart /> : <CheckCircle/>}
            onClick={noLimit ? () => {
                cart.upsert({
                    itemId,
                    optionIds: options,
                    chunk,
                    quantity: 1
                })

                notify(`${item.name} has been added to your cart!`)
            } : undefined}
        >
            <Row fullWidth between>
                <Typography variant="caption">{noLimit ? "add to cart" : "item in your cart"}</Typography>
                <PriceTypography price={price.toValue}
                    discount={item.discount} />
            </Row>
        </Button>
    )
}
