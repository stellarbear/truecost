import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Accordion, AccordionSummary, AccordionDetails, Typography, Divider} from '@material-ui/core';
import {Price} from '@truecost/shared';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {ItemOption} from './ItemOption';
import {ItemHeader} from './ItemHeader';
import {ItemCount} from './ItemCount';
import {ItemExtra} from './ItemExtra';
import {ItemTotal} from './ItemTotal';
import {ItemDivider} from './ItemDivider';
import {ItemRange} from './ItemRange';
import {CheckoutEmpty} from '../CheckoutEmpty';

export const OrderInfo: React.FC = () => {
    const {current: {shop, cart, game: {url}}, update} = useStore();

    const {items: {id: items}, options: {local: {id: local}, global: {id: global}}} = shop();
    const cartItems = cart().local;

    const total = shop().getTotal(cartItems);

    const itemCard = (key: string) => {
        const cartItem = cartItems[key];
        const {itemId, optionIds, chunk, quantity} = cartItem;
        const item = items[itemId];

        const price = Price.fromItem(item, chunk);
        const total = price.withOption(optionIds.map(o => local[o]));

        const upsert = update.cart.upsert;

        return (
            <Accordion key={key} elevation={3}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}>
                    <ItemHeader
                        onDelete={() => update.cart.remove({...cartItem})}
                        item={item} total={total} chunk={chunk}
                        quantity={quantity} />
                </AccordionSummary>
                <AccordionDetails>
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
                                    quantity: 0, chunk: val
                                })}
                        />
                        <ItemOption
                            price={price} item={item}
                            selected={optionIds}
                            onChange={(val: string[]) =>
                                upsert({
                                    ...cartItem,
                                    quantity: 0, optionIds: val
                                })}
                        />
                    </Col>
                </AccordionDetails>
            </Accordion>
        )
    }

    return (
        <Col s={8} fullWidth right>
            <Typography variant="caption">Items</Typography>
            {Object.keys(cartItems).length > 0 ?
                Object.keys(cartItems).map(key => itemCard(key))
                : <CheckoutEmpty />}
            <ItemExtra
                total={total} />
            <ItemTotal
                total={total}
            />
        </Col>
    )
}