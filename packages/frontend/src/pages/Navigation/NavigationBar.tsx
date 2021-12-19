import * as React from 'react';
import {useEffect, useState} from 'react';
import ElevationScroll from 'components/ElevationScroll';
import {AppBar, Hidden, Toolbar} from '@material-ui/core';
import {Mobile} from './Mobile';
import {Desktop} from './Desktop';
import {useLocation} from 'react-router';
import {useStore} from 'pages/Data/Wrapper';

const height = 200;

export const NavigationBar: React.FC = () => {
    const {pathname} = useLocation();
    const [isOnTop, setIsOnTop] = useState(true);
    const {current: {game}} = useStore();

    const calcState = () => window.pageYOffset < height
        && (pathname === "/" ||
            pathname === "/" + game?.url);

    useEffect(() => {
        window.addEventListener("scroll", headerColorChange);
        return () => window.removeEventListener("scroll", headerColorChange);
    }, [pathname]);

    useEffect(() => setIsOnTop(calcState()), [pathname]);

    const headerColorChange = () => setIsOnTop(calcState());
    const logo = isOnTop ? "/logo-white.png" : "/logo-black.png";

    return (
        <ElevationScroll>
            <AppBar style={{
                backgroundColor: isOnTop
                    ? pathname === "/"
                        ? "black"
                        : "transparent"
                    : "white",
                transition: "all 250ms ease 0s",
                color: 'black',
            }}>
                <Toolbar style={{padding: 0}}>
                    <Hidden lgUp>
                        <Mobile logo={logo} />
                    </Hidden>
                    <Hidden mdDown>
                        <Desktop logo={logo} />
                    </Hidden>
                </Toolbar>
            </AppBar>
        </ElevationScroll>
    );
};
