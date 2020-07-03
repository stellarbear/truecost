import React from "react";
import {Button, Divider, Drawer, IconButton} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Clear, Menu} from "@material-ui/icons";
import {AccountPicker} from "components";
import {Link} from "react-router-dom";
import Quick from "./GamePicker";
import {baseGame} from "auxiliary/route";

declare let Tawk_API: any;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: "100%",
        },
    }),
);

interface IMobile {
    logo: string;
    rtl?: boolean;
}

const Mobile: React.FC<IMobile> = ({
                                       logo,
                                       rtl = false,
                                   }) => {
    const classes = useStyles();
    //const { store: { user } } = useContext(UserContext);
    const [open, setOpen] = React.useState<boolean>(false);

    const closeDrawer = (): void => {
        setOpen(false);
    };
    const toggleDrawer = (): void => {
        setOpen(!open);
    };

    const renderNavigation = (): JSX.Element => (
        <React.Fragment>
            <Button component={Link} to="/" onClick={() => closeDrawer()}>Home</Button>
            <Button component={Link} to="/shop" onClick={() => closeDrawer()}>Shop</Button>
            <Button component={Link} to="/track" onClick={() => closeDrawer()}>Track</Button>
            <Button component={Link} to="/blog" onClick={() => closeDrawer()}>Blog</Button>
            <Button component={Link} to="/about" onClick={() => closeDrawer()}>About</Button>
            <Button component={Link} to="/contact" onClick={() => closeDrawer()}>Contact</Button>
            <Button component={Link} to="/checkout" onClick={() => closeDrawer()}>Checkout</Button>
            <Button onClick={() => Tawk_API?.maximize()}>Custom order</Button>
        </React.Fragment>
    );

    const MenuButton = () => {
        return (
            <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={toggleDrawer}
            >
                <Menu/>
            </IconButton>
        );
    };

    const renderAppBar = (): JSX.Element => {
        return (
            <div
                style={{
                    left: 4,
                    position: "absolute",
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                {MenuButton()}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    <Button component={Link} to="/" onClick={() => closeDrawer()}>
                        <img height={48} width={48} src={logo}/>
                    </Button>
                </div>
                <div style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    marginRight: 32,
                }}>
                    <AccountPicker/>
                    {/*(user?.total ?? 0) > 0 && <Chip size="small" color="secondary" label={`${user?.total} %`} style={{ marginRight: 4 }} />*/}
                </div>
            </div>
        );
    };

    const renderDrawer = (): JSX.Element => (
        <Drawer
            variant="temporary"
            open={open}
            onClose={closeDrawer}
            anchor={rtl ? "right" : "left"}
            classes={{
                paper: classes.drawer,
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                }}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <IconButton onClick={toggleDrawer} style={{margin: "8px"}}>
                        <Clear/>
                    </IconButton>
                    <Quick/>
                </div>
                <Divider/>
                {renderNavigation()}
                <img className="float" style={{
                    position: "absolute",
                    bottom: -60,
                    left: -60,
                    width: 200, height: 200, objectFit: "cover", margin: 8, marginLeft: 0,
                }} src={`/${baseGame}/pass.png`}/>
            </div>
        </Drawer>

    );

    return (
        <React.Fragment>
            {renderAppBar()}
            {renderDrawer()}
        </React.Fragment>
    );
};

export default Mobile;
