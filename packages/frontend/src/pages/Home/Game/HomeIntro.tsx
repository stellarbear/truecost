import * as React from 'react';
import {CSSProperties} from 'react';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import {Button, Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {useStore} from 'pages/Data/Wrapper';

interface IProps {
    style?: CSSProperties;
}

export const HomeIntro: React.FC<IProps> = ({style = {}}) => {
    const {current: {game}} = useStore();
    const url = '/' + game.url;

    return (
        <div style={style}>
            <Typography variant="h4" component="h1">{`${game.name} personal service`}</Typography>
            <Typography variant="body1">boosting, coaching, carry</Typography>
            <Button
                component={Link}
                endIcon={<ShoppingBasket />}
                to={url}
                style={{marginTop: 32}}
                variant="contained"
                color="secondary">
                <Typography variant="h6" color="inherit">{`To the shop`}</Typography>
            </Button>
        </div>
    );
};
