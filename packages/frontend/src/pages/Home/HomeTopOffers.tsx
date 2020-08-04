import * as React from 'react';
import {Card, ButtonBase, Paper} from '@material-ui/core';
import {CSSProperties, useContext} from 'react';
import {DataContext, useStore} from 'pages/Data/Wrapper';
import {RowSwipable} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';

export const HomeTopOffers: React.FC = () => {
    const {current: {shop}} = useStore();
    const {items: {id: items}} = shop();

    const top = Object.keys(items).filter(i => items[i].topOffer);

    return (
        <Paper elevation={6}>
            <RowSwipable s={16} p={16} w={250} arrows>
                {top.map(id => <ItemCard key={id} id={id} />)}
            </RowSwipable>
        </Paper>
    )
}
