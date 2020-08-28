import * as React from 'react';
import {useEffect, useState} from 'react';
import ElevationScroll from 'components/ElevationScroll';
import {AppBar, Hidden, Toolbar} from '@material-ui/core';
import {Mobile} from './Mobile';
import {Desktop} from './Desktop';
import {RouteComponentProps, withRouter} from 'react-router';
import {useStore} from 'pages/Data/Wrapper';

const height = 200;

type IProps = RouteComponentProps;

export const NavigationBar: React.FC<IProps> = ({history}) => {
    const [isOnTop, setIsOnTop] = useState(true);
    const {current: {game}} = useStore();

    const calcState = () => window.pageYOffset < height
        && (history.location.pathname === "/" ||
            history.location.pathname === "/" + game?.url);

    useEffect(() => {
        window.addEventListener("scroll", headerColorChange);
        return () => window.removeEventListener("scroll", headerColorChange);
    }, [history.location.pathname]);

    useEffect(() => setIsOnTop(calcState()), [history.location.pathname]);

    const headerColorChange = () => setIsOnTop(calcState());
    const logo = isOnTop ? "/logo-white.png" : "/logo-black.png";

    return (
        <ElevationScroll>
            <AppBar style={{
                backgroundColor: isOnTop ? "transparent" : "white",
                transition: "all 250ms ease 0s",
                color: isOnTop ? 'white' : 'black',
            }}>
                <Toolbar style={{
                    width: "100vw", padding: 0,
                }}>
                    <Hidden lgUp>
                        <Mobile logo={"/logo-black.png"}/>
                    </Hidden>
                    <Hidden mdDown>
                        <Desktop logo={logo}/>
                    </Hidden>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    );
};

export default withRouter(NavigationBar);
