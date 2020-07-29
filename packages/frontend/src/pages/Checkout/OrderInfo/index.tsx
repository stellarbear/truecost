import * as React from 'react';
import {useStore} from 'pages/Data/Wrapper';
import {Col, Row} from 'pages/Base/Grid';
import {Accordion, AccordionSummary, AccordionDetails, IconButton, Typography, Divider} from '@material-ui/core';
import {Price} from '@truecost/shared';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {ItemOption} from './ItemOption';
import {ItemHeader} from './ItemHeader';
import {ItemCount} from './ItemCount';
import {ItemExtra} from './ItemExtra';
import {ItemTotal} from './ItemTotal';
import {ItemDivider} from './ItemDivider';

interface IProps {
    value: Record<string, any>
    setValue: (value: any) => void
}

export const OrderInfo: React.FC<IProps> = ({value, setValue}) => {
    const selected: string[] = value.global || [];
    const {current: {shop, cart, game: {url}}, update} = useStore();

    const {items: {id: items}, options: {local: {id: local}, global: {id: global}}} = shop();
    const cartItems = cart();

    const total = shop().getTotal(cartItems);

    const itemCard = (key: string) => {
        const cartItem = cartItems[key];
        const {itemId, optionIds, chunk, quantity} = cartItem;
        const item = items[itemId];

        const price = Price.fromItem(item, chunk);
        const total = price.withOption(optionIds.map(o => local[o]));

        const itemOptions = shop().getOptions(item.id);
        const upsert = update.cart.upsert;

        return (
            <Accordion key={key}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}>
                    <ItemHeader
                        onDelete={() => update.cart.remove({...cartItem})}
                        item={item} total={total}
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
        <Col s={16} fullWidth right>
            {Object.keys(cartItems).map(key => itemCard(key))}
            <ItemExtra
                total={total}
                selected={selected}
                onChange={(v) => setValue(v)} />
            <ItemTotal
                total={total}
                selected={selected}
            />
        </Col>
    )
}