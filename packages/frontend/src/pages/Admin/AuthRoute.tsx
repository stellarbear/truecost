import React from "react";
import {Redirect, Route, RouteProps} from "react-router";
import {DataContext} from "pages/Base/DataWrapper";

interface AuthRouteProps extends RouteProps {
    unauthorized?: boolean;
    role?: string[];
}

const AuthRoute: React.FC<AuthRouteProps> = ({
                                                 role = [],
                                                 unauthorized = false,
                                                 ...rest
                                             }): JSX.Element => {
    const {store: {user: {data: user}}} = React.useContext(DataContext);

    const buildRoute = () => {
        if (user == undefined && !unauthorized) {
            console.log("redirect 1", user);
            return <Redirect to={"/"}/>;
        }

        if (!(role.length > 0) && user && role.includes(user.role)) {
            console.log("redirect 2");
            return <Redirect to={"/"}/>;
        }

        return <Route {...rest} />;
    };

    return (
        <React.Fragment>
            {buildRoute()}
        </React.Fragment>
    );
};

export default AuthRoute;
