import {Button, Typography} from "@material-ui/core";
import React, {useContext} from "react";
import {AccountPicker} from "components";
import {Link} from 'react-router-dom';
import TrustBox from "pages/Base/TrustBox";
import GamePicker from "./GamePicker";
import {DataContext} from "pages/Data/Wrapper";


interface IDesktop {
    logo: string;
}

const Desktop: React.FC<IDesktop> = (props) => {
    const {logo, } = props;
    const {current: {game}} = useContext(DataContext);
    const url = '/' + game!.url

    const renderNavigation = (): JSX.Element => (
        <div style={{
            maxWidth: 1600,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "auto",
        }}>
            <div style={{display: "flex"}}>
                <div style={{minWidth: 220, maxWidth: 220}}>
                    <TrustBox size="small" />
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
                <Button component={Link} to={url + '/shop'} color="inherit">
                    <Typography variant="h6">SHOP</Typography>
                </Button>
                <Button component={Link} to={'/track'} color="inherit">
                    <Typography variant="h6">TRACK</Typography>
                </Button>
                <Button component={Link} to={url + '/'} style={{padding: 0}}>
                    <img height={100} width={100} src={logo}
                        style={{cursor: "pointer", marginTop: -20, marginBottom: -20}} />
                </Button>
                <Button component={Link} color="inherit" to={'/blog'}>
                    <Typography variant="h6">BLOG</Typography>
                </Button>
                <Button component={Link} color="inherit" to={'/contact'}>
                    <Typography variant="h6">CONTACT</Typography>
                </Button>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "row",
                height: "fit-content",
                justifyContent: "flex-end",
                alignItems: "center",
            }}>
                <GamePicker />
                <AccountPicker />
                {/*(user?.total ?? 0) > 0 && <Chip color="secondary" label={`${user?.total} %`} style={{ marginRight: 4 }} />*/}
            </div>
        </div>
    );

    const renderAppBar = (): JSX.Element => (
        <div
            style={{
                position: "relative",
                marginRight: 32,
                width: "100%",
            }}
        >
            {renderNavigation()}
        </div>
    );

    return (
        <React.Fragment>
            {renderAppBar()}
        </React.Fragment>
    );
};
export default Desktop;
