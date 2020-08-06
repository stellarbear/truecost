import * as React from "react";
import {Button, Divider, Drawer, IconButton} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Clear from "@material-ui/icons/Clear";
import Menu from "@material-ui/icons/Menu";
import {Link} from "react-router-dom";
import {useStore} from "pages/Data/Wrapper";
import {Row, Col} from "pages/Base/Grid";
import {GamePicker} from "./GamePicker";
import {CartPicker} from "./CartPicker";
import {AccountPicker} from "./AccountPicker";
import {frontend, backend} from "auxiliary/route";

interface IProps {
    logo: string;
}


const useStyles = makeStyles({
    paper: {
        overflow: "hidden",
    }
});

export const Mobile: React.FC<IProps> = (props) => {
    const {
        logo,
    } = props;
    const classes = useStyles();
    const [open, setOpen] = React.useState<boolean>(false);
    const {current: {game}} = useStore();
    const url = '/' + game.url

    const image = game.id === "truecost" ? `${frontend.uri}/default/assistant.png`
        : `${backend.uri}/${game.id}/${game.assistant}/u.png`;


    const button = (url: string, text: string) => (
        <Button fullWidth component={Link} to={url} onClick={() => setOpen(false)}>{text}</Button>
    )

    const navigation = () => (
        <Col fullWidth>
            {button(url, "Home")}
            {button(url + '/shop', "Shop")}
            {button(url + '/checkout', "Checkout")}
            <Divider />
            {button("/track", "Track")}
            {button("/blog", "Blog")}
            {button("/contact", "Contact")}
            {button("/about", "About")}
            <Divider />
        </Col>
    );

    const appBar = () => {
        return (
            <Row fullWidth between style={{paddingLeft: 16, paddingRight: 32}}>
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
            <Col fullWidth style={{minWidth: 240}}>
                <Row between>
                    <IconButton onClick={() => setOpen(!open)} style={{margin: "8px"}}>
                        <Clear />
                    </IconButton>
                    <Button component={Link} to={url}>
                        <img height={48} width={48} src={logo}
                            style={{marginTop: -20, marginBottom: -20}} />
                    </Button>
                </Row>
                <Divider />
                {navigation()}
                <img className="float" style={{
                    position: "absolute",
                    bottom: -60,
                    left: -60,
                    width: 200, height: 200, objectFit: "cover", margin: 8, marginLeft: 0,
                }} src={image} />
            </Col>
        </Drawer >

    );

    return (
        <>
            {appBar()}
            {drawer()}
        </>
    );
};