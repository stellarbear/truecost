import * as React from "react";
import {Button, Divider, Drawer, IconButton} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import Clear from "@material-ui/icons/Clear";
import Menu from "@material-ui/icons/Menu";
import {Link, useLocation} from "react-router-dom";
import {useStore} from "pages/Data/Wrapper";
import {Col, Row} from "pages/Base/Grid";
import {GamePicker} from "./GamePicker";
import {CartPicker} from "./CartPicker";
import {AccountPicker} from "./AccountPicker";
import {backend, frontend} from "auxiliary/route";
import {SafeImage} from "components/SafeImage";

interface IProps {
    logo: string;
}


const useStyles = makeStyles({
    paper: {
        overflow: "hidden",
    },
});

export const Mobile: React.FC<IProps> = (props) => {
    const {
        logo,
    } = props;
    const classes = useStyles();
    const {pathname} = useLocation();
    const [open, setOpen] = React.useState<boolean>(false);
    const {current: {game}} = useStore();
    const url = '/' + ((pathname !== '/') ? game.url : '');

    const image = game.id === "truecost" ? `${frontend.uri}/default/assistant.png`
        : `${backend.uri}/${game.id}/${game.assistant}/u.png`;

    const button = (url: string, text: string) => (
        <Button fullWidth component={Link} to={url} onClick={() => setOpen(false)}>{text}</Button>
    );

    const navigation = () => (
        <Col>
            {button(url, "Home")}
            {pathname !== "/" && button(url + '/shop', "Shop")}
            {button(url + '/checkout', "Checkout")}
            <Divider />
            {button("/blog", "Blog")}
            {button("/track", "Track")}
            {button("/discount", "Discount")}
            {button("/contact", "Contact")}
            {button("/about", "About")}
            <Divider />
        </Col>
    );

    const appBar = () => {
        return (
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
                    <GamePicker />
                </Row>
                <Row>
                    <CartPicker />
                    <AccountPicker />
                </Row>
            </Row>
        );
    };

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
                    <Button component={Link} to={url}>
                        <img
                            alt="logo icon"
                            height={48} width={48} src={logo}
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
