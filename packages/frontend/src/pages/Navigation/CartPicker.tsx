import * as React from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {IconButton, Badge} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {useStore} from 'pages/Data/Wrapper';

export const CartPicker: React.FC = () => {
    const {current: {game}, update: {cart: {count}}} = useStore();
    const url = '/' + game.url

    return (
        <IconButton component={Link} to={url + '/checkout'} color="secondary">
            <Badge badgeContent={count()} color="primary">
                <ShoppingCartIcon />
            </Badge>
        </IconButton>
    )
}