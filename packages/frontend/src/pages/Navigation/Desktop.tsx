import {Button, Chip, Container, Typography} from "@material-ui/core";
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
        <Row fullWidth>
            <Button component={Link} to={url + '/shop'} color="inherit">
                <Typography variant="h6">SHOP</Typography>
            </Button>
            <Button component={Link} to={'/track'} color="inherit">
                <Typography variant="h6">TRACK</Typography>
            </Button>
            <Button component={Link} color="inherit" to={'/blog'} disabled>
                <Typography variant="h6">BLOG</Typography>
            </Button>
            <Button component={Link} color="inherit" to={'/contact'}>
                <Typography variant="h6">CONTACT</Typography>
            </Button>
        </Row>
    );

    const subscription = () => (
        discount > 0 && (
            <Chip
                size="small"
                color="secondary"
                label={`${discount} % active`}
            />
        )
    );

    const account = () => (
        <div style={{
            position: "absolute",
            right: 16,
            top: 0,
        }}>
            <Row>
                {subscription()}
                <CartPicker/>
                <Account/>
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
                    <img height={80} width={80} src={logo}
                         style={{marginTop: -20, marginBottom: -20}}/>
                </Button>
                <GamePicker/>
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


/*


<div style={{
    display: "flex",
    flexDirection: "row",
    height: "fit-content",
    justifyContent: "flex-end",
    alignItems: "center",
}}>
    <GamePicker />
    <AccountPicker />
    {/*(user?.total ?? 0) > 0 && <Chip color="secondary" label={`${user?.total} %`} style={{ marginRight: 4 }} />}
</div>
*/
