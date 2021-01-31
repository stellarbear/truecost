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
    const {current: {game}, subs} = useStore();
    const url = '/' + game.url;

    const max = Math.max(...Object.values(subs).map(s => s.discount));

    const discount = () => (
        <>
            <Typography
                style={{marginTop: 32}}
                variant="h4" component="div" color="inherit">Get your personal up&nbsp;to</Typography>
            <Button
                component={Link}
                to="discount"
                style={{marginTop: 8}}
                variant="contained"
                color="secondary">
                <Typography variant="h6" component="div" color="inherit">{`${max} % discount `}</Typography>
            </Button>
            <Typography
                style={{marginTop: 8}}
                variant="body1" color="inherit">{`on everything`}</Typography>
        </>
    );

    return (
        <div style={style}>
            <Typography variant="h4" component="h1">{`${game.name} personal service`}</Typography>
            <Typography variant="body1">boosting, coaching, carry</Typography>
            {max > 0 && discount()}
            <Button
                component={Link}
                endIcon={<ShoppingBasket />}
                to={url + "/shop"}
                style={{marginTop: 32}}
                variant="contained"
                color="secondary">
                <Typography variant="h6" color="inherit">{`To the shop`}</Typography>
            </Button>
        </div>
    );
};
