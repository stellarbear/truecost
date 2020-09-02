import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col} from 'pages/Base/Grid';
import {Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core';
import {CalcPrice} from '@truecost/shared';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {ItemOption} from './ItemOption';
import {ItemHeader} from './ItemHeader';
import {ItemCount} from './ItemCount';
import {ItemExtra} from './ItemExtra';
import {ItemTotal} from './ItemTotal';
import {ItemDivider} from './ItemDivider';
import {ItemRange} from './ItemRange';
import {CheckoutEmpty} from './CheckoutEmpty';

export const OrderInfo: React.FC = () => {
    const {current: {shop, cart}, update} = useStore();

    const {items: {id: items}, options: {local: {id: local}}} = shop();
    const cartItems = cart().local;

    const total = shop().getTotal(cartItems);

    const itemCard = (key: string) => {
        const cartItem = cartItems[key];
        const {itemId, optionIds, chunk, quantity} = cartItem;
        const item = items[itemId];

        const itemPrice = CalcPrice.fromItem(item, chunk);
        const totalPrice = CalcPrice.fromItemAndOptions(itemPrice, optionIds.map(o => local[o]));

        const upsert = update.cart.upsert;

        return (
            <ExpansionPanel key={key} elevation={3} TransitionProps={{unmountOnExit: true}}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMore />}>
                    <ItemHeader
                        onDelete={() => update.cart.remove({...cartItem})}
                        item={item} total={totalPrice} chunk={chunk}
                        quantity={quantity} />
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Col fullWidth style={{width: "100%"}}>
                        <ItemDivider condition={true} />
                        <ItemCount
                            onAdd={() => upsert({...cartItem, quantity: +1})}
                            onRemove={() => upsert({...cartItem, quantity: -1})}
                            quantity={quantity}
                            item={item}
                        />
                        <ItemRange
                            item={item}
                            chunk={chunk || [0, 0]}
                            onChange={(val: [number, number]) =>
                                upsert({
                                    ...cartItem,
                                    quantity: 0, chunk: val,
                                })}
                        />
                        <ItemOption
                            price={itemPrice} item={item}
                            selected={optionIds}
                            onChange={(val: string[]) =>
                                upsert({
                                    ...cartItem,
                                    quantity: 0, optionIds: val,
                                })}
                        />
                    </Col>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    };

    const keys = Object.keys(cartItems);

    return (
        <Col s={8} fullWidth right>
            <Typography variant="caption">Items</Typography>
            {keys.length > 0
                ? keys.map(key => itemCard(key))
                : <CheckoutEmpty />}
            <ItemExtra
                total={total} />
            <ItemTotal
                total={total} />
        </Col>
    );
};
