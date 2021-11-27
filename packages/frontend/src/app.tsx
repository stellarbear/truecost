import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthRoute from "pages/Admin/AuthRoute";
import { DataContext, DataWrapper } from "pages/Data/Wrapper";
import Shop from "pages/Shop/Shop";
import { Login } from "pages/User";
import { Discount } from "pages/Discount";
import { Item } from "pages/Item";
import { LoadingWrapper } from "components/wrappers/LoadingWrapper";
import { Register } from "pages/User/Register/Register";
import { RegisterMessage } from "pages/User/Register/RegisterMessage";
import { RegisterVerify } from "pages/User/Register/RegisterVerify";
import { Admin } from "pages/Admin";
import { RoleType } from "@truecost/shared";
import { Checkout } from "pages/Checkout";
import { PasswordForget } from "pages/User/Password/PasswordForget";
import { PasswordReset } from "pages/User/Password/PasswordReset";
import { PasswordMessage } from "pages/User/Password/PasswordMessage";
import { CheckoutSuccess } from "pages/Checkout/CheckoutSuccess";
import { Track } from "pages/Track";
import { Account } from "pages/Account";
import { useScript } from "auxiliary/useScript";
import { google, tawk, yandex } from "scripts";
import { Contact, Policy, TOS } from "pages";
import NotFound from "pages/NotFound";
import { NavigationWrapper } from "pages/Navigation";
import { NotifyWrapper } from "components/wrappers/NotifyWrapper";
import { Blog } from "pages/Blog";
import { BlogPost } from "pages/Blog/BlogPost";
import { HomeGame, HomeLanding } from "pages/Home";
import { CheckoutPaypal } from "pages/Checkout/CheckoutPaypal";
import { CheckoutStripe } from "pages/Checkout/CheckoutStripe";
import { BookingOrderLink } from "pages/Admin/BookingOrderLink";
import { CheckoutDirect } from "pages/Checkout/Direct";


const App = () => {
    useScript(tawk);
    useScript(yandex);
    useScript(google);

    const routes = (urls: string[]) => (
        <NavigationWrapper>
            <Route sensitive exact path={"/"} component={HomeLanding} />

            <Route sensitive exact
                path={urls.map(u => '/' + u)} component={HomeGame} />
            <Route sensitive exact path={urls.map(u => '/' + u + '/shop/:tag?')} component={Shop} />

            <Route sensitive exact path={`/checkout/direct/:id`} component={CheckoutDirect} />
            <Route sensitive exact path={`/checkout/paypal`} component={CheckoutPaypal} />
            <Route sensitive exact path={`/checkout/stripe`} component={CheckoutStripe} />
            <Route sensitive exact path={urls.map(u => '/' + u + '/checkout/stripe')}
                component={CheckoutStripe} />
            <Route sensitive exact path={urls.map(u => '/' + u + '/checkout/paypal')}
                component={CheckoutPaypal} />
            <Route sensitive exact path={urls.map(u => '/' + u + '/checkout/success/:code?')}
                component={CheckoutSuccess} />
            <Route sensitive exact path={urls.map(u => '/' + u + '/checkout/:step?')}
                component={Checkout} />

            <Route sensitive exact path={urls.map(u => '/' + u + '/item/:url')} component={Item} />

            <AuthRoute sensitive path={`/booking/link`} component={BookingOrderLink} />
            <AuthRoute sensitive path={`/account`} component={Account} />
            <AuthRoute sensitive path={`/admin`} component={Admin} roles={[RoleType.ADMIN]} />

            <AuthRoute sensitive exact path={`/login`} component={Login} unauthorized />

            <AuthRoute sensitive exact path={`/register`} component={Register} unauthorized />
            <AuthRoute sensitive exact path={`/register/verify/:verify/:value`}
                component={RegisterVerify}
                unauthorized />
            <AuthRoute sensitive exact path={`/register/message`} component={RegisterMessage}
                unauthorized />

            <AuthRoute sensitive exact path={`/password/forget`} component={PasswordForget}
                unauthorized />
            <AuthRoute sensitive exact path={`/password/forget/:forget/:value`}
                component={PasswordReset}
                unauthorized />
            <AuthRoute sensitive exact path={`/password/message`} component={PasswordMessage}
                unauthorized />

            <Route sensitive exact path={`/blog`} component={Blog} />
            <Route sensitive exact path={`/post/:id`} component={BlogPost} />
            <Route sensitive exact path={`/track`} component={Track} />
            <Route sensitive exact path={`/discount`} component={Discount} />
            <Route sensitive exact path={`/contact`} component={Contact} />
            <Route sensitive exact path={`/policy`} component={Policy} />
            <Route sensitive exact path={`/tos`} component={TOS} />

            <Route
                render={({ staticContext }) => {
                    if (staticContext) {
                        staticContext.statusCode = 301;
                    }
                    return <Redirect from={`/about`} to={"/"} />;
                }}
            />

            <Route
                render={({ staticContext }) => {
                    if (staticContext) {
                        staticContext.statusCode = 404;
                    }
                    return <NotFound />;
                }}
            />

        </NavigationWrapper>
    );

    return (
        <LoadingWrapper>
            <NotifyWrapper>
                <DataWrapper>
                    <DataContext.Consumer>
                        {({ games }) => routes(Object.values(games.id).map(value => value.url))}
                    </DataContext.Consumer>
                </DataWrapper>
            </NotifyWrapper>
        </LoadingWrapper>
    );
};

export default App;
