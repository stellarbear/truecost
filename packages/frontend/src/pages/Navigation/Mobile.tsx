import * as React from "react";
import {Button, Divider, Drawer, IconButton} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import Clear from "@material-ui/icons/Clear";
import Menu from "@material-ui/icons/Menu";
import {Link, useHistory, useLocation} from "react-router-dom";
import {useStore} from "pages/Data/Wrapper";
import {Col, Row} from "pages/Base/Grid";
import {GamePicker} from "./GamePicker";
import {CartPicker} from "./CartPicker";
import {AccountPicker} from "./AccountPicker";
import {backend, frontend} from "auxiliary/route";
import {SafeImage} from "components/SafeImage";
import {CurrencyPicker} from "./CurrencyPicker";

interface IProps {
    logo: string;
}

const useStyles = makeStyles({
    paper: {
        overflow: "hidden",
    },
});

export const Mobile: React.FC<IProps> = (props) => {
    const {logo} = props;
    const classes = useStyles();
    const history = useHistory();
    const {pathname} = useLocation();
    const [open, setOpen] = React.useState<boolean>(false);
    const {current: {game}, games, update: {setGame}} = useStore();
    const homeUrl = (['/', `/${game.url}`].includes(pathname) ? '/' : ('/' + game.url));
    const url = '/' + game.url;

    const image = game.id === "truecost" ? `${frontend.uri}/default/assistant.png`
        : `${backend.uri}/${game.id}/${game.assistant}/u.png`;

    const button = (url: string, text: string, key?: string) => (
        <Button
            key={key}
            fullWidth
            component={Link} to={url}
            onClick={() => setOpen(false)}>
            {text}
        </Button>
    );

    const navigation = () => (
        <Col>
            {pathname !== "/" && button(url, "Shop")}
            {button(url + '/checkout', "Checkout")}
            {button("/track", "Track")}
            <Divider />
            {button("/contact", "Contact")}
            {button("/about", "About")}
            {button("/blog", "Blog")}
            <Divider />
            {Object.keys(games.id).map((gameId) => (
                <Button
                    key={gameId}
                    fullWidth
                    onClick={() => {
                        setGame(gameId);
                        setOpen(false);
                        history.push('/' + games.id[gameId].url);
                    }}>
                    {games.id[gameId].name}
                </Button>
            ))}
            <Divider />
        </Col>
    );

    const home = () => pathname === "/" && (
        <Button component={Link} to={'/'}>
            <img
                alt="logo icon"
                height={80} width={80} src={logo}
                style={{marginTop: -20, marginBottom: -20}} />
        </Button>
    );

    const appBar = () => (
        <Row fullWidth justify="space-between"
            style={{paddingLeft: 16, paddingRight: 32}}>
            <Row>
                <IconButton
                    color="inherit"
                    aria-label="Open drawer"
                    onClick={() => setOpen(!open)}
                >
                    <Menu />
                </IconButton>
                <GamePicker mobile />
                {home()}
            </Row>
            <Row>
                <CurrencyPicker style={{marginRight: -12}} />
                <CartPicker />
                <AccountPicker />
            </Row>
        </Row>
    );

    const drawer = () => (
        <Drawer
            classes={{
                paper: classes.paper,
            }}
            variant="temporary"
            open={open}
            onClose={() => setOpen(false)}
            anchor={"left"}>
            <Col style={{minWidth: 240}} >
                <Row justify="space-between">
                    <IconButton onClick={() => setOpen(!open)} style={{margin: "8px"}}>
                        <Clear />
                    </IconButton>
                    <Button component={Link} to={homeUrl}>
                        <img
                            alt="logo icon"
                            height={48} width={48} src={"/logo-black.png"}
                            style={{marginTop: -20, marginBottom: -20}} />
                    </Button>
                </Row>
                <Divider />
                {navigation()}
                <SafeImage
                    alt={"assistant icon"}
                    className="float"
                    height={"inherit"}
                    src={image} style={{
                        padding: 16,
                        width: 60, height: 60, objectFit: "cover",
                    }} />
            </Col>
        </Drawer>

    );

    return (
        <>
            {appBar()}
            {drawer()}
        </>
    );
};
