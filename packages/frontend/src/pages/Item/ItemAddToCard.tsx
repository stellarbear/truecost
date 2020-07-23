import * as React from 'react';
import {IItem, Price} from "@truecost/shared";
import {DataContext} from 'pages/Data/Wrapper';
import {Chip, Typography, Checkbox, Button} from '@material-ui/core';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import {PriceTypography} from 'pages/Base/PriceTypography';
import {Row} from 'pages/Base/Grid';
import {NotificationContext} from 'components/wrappers';
import {useContext} from 'react';

interface IProps {
    item: IItem
    options: string[]
    price: Price
}

export const ItemAddToCard: React.FC<IProps> = (props) => {
    const {item, options, price} = props;
    const itemId = item.id

    const {notify} = useContext(NotificationContext)

    const {current: {shop, game: {url}}} = useContext(DataContext);
    const {cart} = shop();

    return (
        <Button
            style={{width: "100%",}}
            size="large"
            color="primary"
            variant="contained"
            startIcon={<AddShoppingCart/>}
            onClick={() => {
                cart.add({id: itemId, options})
                notify(`${item.name} has been added to your cart!`)
            }}
        >
            <Row fullWidth between>
                <Typography variant="caption">add to cart</Typography>
                <PriceTypography price={price.toValue}
                                 discount={item.discount}/>
            </Row>
        </Button>
    )
}
