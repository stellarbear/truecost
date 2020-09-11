import * as React from 'react';
import {Paper} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {RowGrid} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';

export const HomeTopOffers: React.FC = () => {
    const {current: {shop}} = useStore();
    const {items: {id: items}} = shop();

    const top = Object.keys(items).filter(i => items[i].topOffer);

    if (top.length === 0) {
        return <div />;
    }

    return (
        <Paper elevation={6} style={{padding: 16}}>
            <RowGrid w={250} s={16} p={16}>
                {top.map(id => <ItemCard key={id} id={id} />)}
            </RowGrid>
        </Paper>
    );
};
