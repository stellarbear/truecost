import {Container, Toolbar} from "@material-ui/core";
import React from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Switch} from "react-router";
import "css/router-animation.css";
import {Footer} from "./Footer";
import NavigationBar from "./NavigationBar";


export const NavigationWrapper: React.FC = (props) => {
    const {
        children,
    } = props;

    return (
        <React.Fragment>
            <TransitionGroup component="main" className="animated-router-outer">
                <CSSTransition timeout={300} classNames="fade" appear>
                    <section className="animated-router-inner" style={{
                        height: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <NavigationBar/>
                        <div>
                            <Toolbar style={{margin: 8}}/>
                            <Container fixed>
                                <Switch>
                                    {children}
                                </Switch>
                            </Container>
                        </div>
                        <Container fixed>
                            <Footer/>
                        </Container>
                    </section>
                </CSSTransition>
            </TransitionGroup>
        </React.Fragment>
    );
};
