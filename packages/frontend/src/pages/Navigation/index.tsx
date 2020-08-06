import {AppBar, Container, Hidden, Toolbar} from "@material-ui/core";
import React, {useEffect, useState, useContext} from "react";
import {Mobile} from "./Mobile";
import {Desktop} from "./Desktop";
import ElevationScroll from "components/ElevationScroll";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Switch, withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import "css/router-animation.css";
import window from 'global';
import {DataContext} from "pages/Data/Wrapper";
import {Footer} from "./Footer";

interface INavigationProps extends RouteComponentProps {
    height?: number;
}

const NavigationWrapper: React.FC<INavigationProps> = (props) => {
    const {
        history,
        location,
        children,
        height = 200,
    } = props;
    const {current: {game}} = useContext(DataContext);
    const calcState = () => window.pageYOffset < height
        && (history.location.pathname === "/" ||
            history.location.pathname === "/" + game?.url);
    const [isOnTop, setIsOnTop] = useState(true);

    useEffect(() => {
        window.addEventListener("scroll", headerColorChange);
        return () => window.removeEventListener("scroll", headerColorChange);
    }, []);

    useEffect(() => setIsOnTop(calcState()), [history.location.pathname]);

    const headerColorChange = () => setIsOnTop(calcState());
    const logo = isOnTop ? "/logo-white.png" : "/logo-black.png";

    return (
        <React.Fragment>
            <TransitionGroup component="main" className="animated-router-outer">
                <CSSTransition key={location.key} timeout={300} classNames="fade" appear>
                    <section className="animated-router-inner" style={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>

                        <div>
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
                                            <Mobile logo={"/logo-black.png"} />
                                        </Hidden>
                                        <Hidden mdDown>
                                            <Desktop logo={logo} />
                                        </Hidden>
                                    </Toolbar>
                                </AppBar>
                            </ElevationScroll>
                            <Toolbar style={{margin: 8}} />
                            <Container fixed>
                                <Switch location={location}>
                                    {children}
                                </Switch>
                            </Container>
                        </div>
                        <Container fixed>
                            <Footer />
                        </Container>
                    </section>
                </CSSTransition>
            </TransitionGroup>
        </React.Fragment>
    );
};

export default withRouter(NavigationWrapper);
