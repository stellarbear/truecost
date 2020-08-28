import * as React from 'react';
import {CSSProperties} from 'react';
import ArrowDown from '@material-ui/icons/ArrowDownward';
import {Button, IconButton, Typography} from '@material-ui/core';
import {Link} from 'react-router-dom';
import {useStore} from 'pages/Data/Wrapper';

interface IProps {
    style?: CSSProperties;
}

export const HomeIntro: React.FC<IProps> = ({style = {}}) => {
    const {current: {game}, subs} = useStore();
    const max = Math.max(...Object.values(subs).map(s => s.discount));

    const discount = () => (
        <>
            <Typography
                style={{marginTop: 32}}
                variant="h4" component="p" color="inherit">Get your personal up&nbsp;to</Typography>
            <Button
                component={Link}
                to="discount"
                style={{marginTop: 8}}
                variant="contained"
                color="secondary">
                <Typography variant="h6" color="inherit">{`${max} % discount `}</Typography>
            </Button>
            <Typography
                style={{marginTop: 8}}
                variant="body1" color="inherit">{`on everything`}</Typography>
        </>
    );

    return (
        <div style={style}>
            <Typography variant="h4">{`${game.name} premium service`}</Typography>
            <Typography variant="body1">boosting, coaching, carry</Typography>
            {max > 0 && discount()}
            <IconButton
                className="float"
                style={{
                    marginTop: 32,
                    backgroundColor: "#fff",
                }}
                onClick={() => window.scrollBy({top: 400, behavior: "smooth"})}>
                <ArrowDown/>
            </IconButton>
        </div>
    );
};
