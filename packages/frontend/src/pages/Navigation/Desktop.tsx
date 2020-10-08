import {Button, Chip, Container, Tooltip, Typography} from "@material-ui/core";
import React from "react";
import {Link} from 'react-router-dom';
import {useStore} from "pages/Data/Wrapper";
import {Row} from "pages/Base/Grid";
import {Account} from './Account';
import {GamePicker} from "./GamePicker";
import {CartPicker} from "./CartPicker";

interface IDesktop {
    logo: string;
}

export const Desktop: React.FC<IDesktop> = (props) => {
    const {logo} = props;
    const {current: {game, discount}} = useStore();
    const url = '/' + game.url;

    const navigation = () => (
        <Row justify="center">
            <Button component={Link} to={url + '/shop'} color="inherit">
                <Typography variant="h6">SHOP</Typography>
            </Button>
            <Button component={Link} to={'/track'} color="inherit">
                <Typography variant="h6">TRACK</Typography>
            </Button>
            <Button component={Link} color="inherit" to={'/discount'}>
                <Typography variant="h6">DISCOUNT</Typography>
            </Button>
            <Button component={Link} color="inherit" to={'/blog'}>
                <Typography variant="h6">BLOG</Typography>
            </Button>
            <Button component={Link} color="inherit" to={'/contact'}>
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
                <Button component={Link} to={url}>
                    <img
                        alt="logo icon"
                        height={80} width={80} src={logo}
                        style={{marginTop: -20, marginBottom: -20}} />
                </Button>
                <GamePicker />
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