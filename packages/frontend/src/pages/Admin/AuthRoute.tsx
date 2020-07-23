import * as React from "react";
import {Redirect, Route, RouteProps} from "react-router";
import {DataContext} from "pages/Data/Wrapper";

interface AuthRouteProps extends RouteProps {
    unauthorized?: boolean;
    roles?: string[];
}

const AuthRoute: React.FC<AuthRouteProps> = ({
                                                 roles = [],
                                                 unauthorized = false,
                                                 ...rest
                                             }) => {
    const {store: {user: {data: user}}} = React.useContext(DataContext);

    const buildRoute = () => {
        if (!user && !unauthorized) {
            //console.log("redirect 1", user);
            return <Redirect to={"/"}/>;
        }

        if (user && !roles.includes(user.role)) {
            //console.log("redirect 2");
            return <Redirect to={"/"}/>;
        }

        //console.log("redirect 3");
        return <Route {...rest} />;
    };

    return (
        <React.Fragment>
            {buildRoute()}
        </React.Fragment>
    );
};

export default AuthRoute;
