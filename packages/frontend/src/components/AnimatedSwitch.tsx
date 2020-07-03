import React from "react";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import {Switch, withRouter} from "react-router";
import {RouteComponentProps} from "react-router-dom";
import "css/router-animation.css";
import Footer from "pages/Base/Footer";

const AnimatedSwitch: React.FC<RouteComponentProps> = ({location, children}): JSX.Element => (
    <TransitionGroup component="main" className="animated-router-outer">
        <CSSTransition key={location.key} timeout={300} classNames="fade" appear>
            <section className="animated-router-inner">
                <div style={{minHeight: "calc(100vh - 284px)"}}>
                    <Switch location={location}>
                        {children}
                    </Switch>
                </div>
                <Footer/>
            </section>
        </CSSTransition>
    </TransitionGroup>
);

export default withRouter(AnimatedSwitch);
