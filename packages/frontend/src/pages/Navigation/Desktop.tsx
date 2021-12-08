import {Button, Chip, Container, Tooltip, Typography} from "@material-ui/core";
import React from "react";
import {Link, useLocation} from 'react-router-dom';
import {useStore} from "pages/Data/Wrapper";
import {Row} from "pages/Base/Grid";
import {Account} from './Account';
import {GamePicker} from "./GamePicker";
import {CartPicker} from "./CartPicker";
import {CurrencyPicker} from "./CurrencyPicker";

interface IDesktop {
    logo: string;
}

const animate = {transition: "all 0.3s"};

export const Desktop: React.FC<IDesktop> = (props) => {
    const {logo} = props;
    const {pathname} = useLocation();
    const {current: {game, discount}} = useStore();
    const homeUrl = (['/', `/${game.url}`].includes(pathname) ? '/' : ('/' + game.url));
    const url = '/' + game.url;

    const navigation = () => (
        <Row justify="center" style={{transform: "all 0.5s"}}>
            <Button component={Link} to={url + '/shop'}
                style={{
                    ...animate,
                    ...(pathname === "/" ? ({
                        marginLeft: -64,
                        opacity: 0,
                    }) : ({})),
                }}
                color="inherit">
                <Typography variant="h6">SHOP</Typography>
            </Button>
            <Button component={Link} to={'/track'}
                color="inherit" style={animate}>
                <Typography variant="h6">TRACK</Typography>
            </Button>
            <Button component={Link} to={'/blog'}
                color="inherit" style={animate}>
                <Typography variant="h6">BLOG</Typography>
            </Button>
            <Button component={Link} to={'/contact'}
                color="inherit" style={animate}>
                <Typography variant="h6">CONTACT</Typography>
            </Button>
        </Row>
    );

    const subscription = () => (
        discount > 0 && (
            <Tooltip title="Your discount is active">
                <Chip
                    size="small"
                    color="secondary"
                    label={`${discount} %`}
                />
            </Tooltip>
        )
    );
    const account = () => (
        <div style={{
            position: "absolute",
            right: 16,
            top: 0,
        }}>
            <Row align="center">
                {subscription()}
                <CurrencyPicker style={{marginRight: -12}} />
                <CartPicker />
                <Account />
            </Row>
        </div>
    );

    const home = () => (
        <div style={{
            position: "absolute",
            left: 16,
            top: -8,
        }}>
            <Row>
                <Button component={Link} to={homeUrl}>
                    <img
                        alt="logo icon"
                        height={80} width={80} src={logo}
                        style={{marginTop: -20, marginBottom: -20}} />
                </Button>
                <div style={{marginTop: 8}}>
                    <GamePicker />
                </div>
            </Row>
        </div>
    );

    return (
        <Container fixed style={{position: "relative"}}>
            {home()}
            {navigation()}
            {account()}
        </Container>
    );
};
