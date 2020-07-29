import * as React from "react";
import {Home, NotFound} from "pages";
import {Route, Switch} from "react-router-dom";
import {NotifyWrapper} from "components/wrappers";
import NavigationWrapper from "pages/Navigation";
import AuthRoute from "pages/Admin/AuthRoute";
import Policy from "pages/Policy";
import About from "pages/About";
import TOS from "pages/TOS";
import Contact from "pages/Contact";
import {DataContext, DataWrapper} from "pages/Data/Wrapper";
import {admin} from "pages/Admin/routes";
import Shop from "pages/Shop/Shop";
import {Login} from "pages/User";
import {Item} from "pages/Item/Item";
import {LoadingWrapper} from "components/wrappers/LoadingWrapper";
import {Register} from "pages/User/Register/Register";
import {RegisterMessage} from "pages/User/Register/RegisterMessage";
import {RegisterVerify} from "pages/User/Register/RegisterVerify";
import {Admin} from "pages/Admin";
import {RoleType} from "@truecost/shared";
import {Checkout} from "pages/Checkout/Checkout";


const App = () => {
    return (
        <LoadingWrapper>
            <NotifyWrapper>
                <DataWrapper>
                    <DataContext.Consumer>
                        {({store: {game}}) => {
                            const urls = Object.values(game.data.id).map(value => value.url);

                            return (
                                    <NavigationWrapper>
                                        <Route exact path={urls.map(u => '/' + u)} component={Home} />
                                        <Route exact path={urls.map(u => '/' + u + '/shop')} component={Shop} />
                                        <Route exact path={urls.map(u => '/' + u + '/checkout')} component={Checkout} />
                                        <Route exact path={urls.map(u => '/' + u + '/item/:url')} component={Item} />

                                        <AuthRoute path={`/admin`} component={Admin} roles={[RoleType.ADMIN]} />

                                        <AuthRoute exact path={`/login`} component={Login} unauthorized />
                                        <AuthRoute exact path={`/register`} component={Register} unauthorized />
                                        <AuthRoute exact path={`/register/verify/:verify/:value`} component={RegisterVerify}
                                            unauthorized />
                                        <AuthRoute exact path={`/register/message`} component={RegisterMessage}
                                            unauthorized />

                                        <Route exact path={`/contact`} component={Contact} />
                                        <Route exact path={`/policy`} component={Policy} />
                                        <Route exact path={`/about`} component={About} />
                                        <Route exact path={`/tos`} component={TOS} />
                                        <Route
                                            render={({staticContext}) => {
                                                if (staticContext) {
                                                    staticContext.statusCode = 404;
                                                }
                                                return <NotFound />;
                                            }}
                                        />
                                    </NavigationWrapper>
                            );
                        }}
                    </DataContext.Consumer>
                </DataWrapper>
            </NotifyWrapper>
        </LoadingWrapper>
    );
};

export default App;
