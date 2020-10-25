import * as React from 'react';
import {Button, Paper} from '@material-ui/core';
import {useStore} from 'pages/Data/Wrapper';
import {RowGrid} from 'pages/Base/Grid';
import ItemCard from 'pages/Shop/ItemCard';
import {Link} from 'react-router-dom';

export const HomeTopOffers: React.FC = () => {
    const {current: {shop, game}} = useStore();
    const {items: {id: items}} = shop();
    const url = '/' + game.url;

    const top = Object.keys(items).filter(i => items[i].topOffer);

    if (top.length === 0) {
        return <div />;
    }

    return (
        <Paper elevation={6} style={{padding: 16}}>
            <RowGrid w={250} s={16} p={16}>
                {top.map(id => <ItemCard key={id} id={id} />)}
            </RowGrid>
            <Button fullWidth
                component={Link} to={url + "/shop"}
                style={{
                    margin: "8px 0px -16px 0px",
                    padding: "16px",
                }}>
                Show more
            </Button>
        </Paper>
    );
};
