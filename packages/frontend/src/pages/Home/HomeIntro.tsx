import * as React from 'react';
import ArrowDown from '@material-ui/icons/ArrowDownward'
import {Card, ButtonBase, Typography, Button, IconButton} from '@material-ui/core';
import {CSSProperties} from 'react';
import {Link} from 'react-router-dom';
import {DataContext, useStore} from 'pages/Data/Wrapper';

interface IProps {
    style?: CSSProperties
}

export const HomeIntro: React.FC<IProps> = ({style = {}}) => {
    const {current: {game}} = useStore();
    const current = game!;

    return (
        <div style={style}>
            <Typography variant="h4">{`${current.name} premium service`}</Typography>
            <Typography variant="body1">boosting, coaching, carry</Typography>

            <Typography
                style={{marginTop: 32}}
                variant="h4" component="p" color="inherit">Get your personal up&nbsp;to</Typography>
            <Button
                component={Link}
                to="discount"
                style={{marginTop: 8}}
                variant="contained"
                color="secondary">
                <Typography variant="h6" color="inherit">{`SOME % discount `}</Typography>
            </Button>
            <Typography
                style={{marginTop: 32}}
                variant="body1" color="inherit">{`on everything`}</Typography>
            <IconButton
                className="float"
                style={{
                    marginTop: 32,
                    backgroundColor: "#fff"
                }}
                onClick={() => window.scrollBy({top: 400, behavior: "smooth"})}>
                <ArrowDown/>
            </IconButton>
        </div>
    )
}
