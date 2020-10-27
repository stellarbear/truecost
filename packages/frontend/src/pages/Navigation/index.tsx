import {Container, Toolbar} from "@material-ui/core";
import React from "react";
import {Switch} from "react-router";
import {Footer} from "./Footer";
import {NavigationBar} from "./NavigationBar";


export const NavigationWrapper: React.FC = (props) => {
    const {
        children,
    } = props;

    return (
        <React.Fragment>
            <section style={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}>
                <NavigationBar />
                <div>
                    <Toolbar style={{margin: 8}} />
                    <Container fixed>
                        <Switch>
                            {children}
                        </Switch>
                    </Container>
                </div>
                <Container fixed>
                    <Footer />
                </Container>
            </section>
        </React.Fragment>
    );
};
