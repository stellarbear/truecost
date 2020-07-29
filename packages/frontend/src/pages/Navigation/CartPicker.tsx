import * as React from 'react';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import {IconButton} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {useStore} from 'pages/Data/Wrapper';

export const CartPicker: React.FC = () => {
    const {current: {game}} = useStore();
    const url = '/' + game.url

    return (
        <IconButton component={Link} to={url + '/checkout'} color="inherit">
            <ShoppingCartIcon/>
        </IconButton>
    )
}