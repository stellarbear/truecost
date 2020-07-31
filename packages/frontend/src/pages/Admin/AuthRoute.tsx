import * as React from "react";
import {Redirect, Route, RouteProps} from "react-router";
import {DataContext, useStore} from "pages/Data/Wrapper";

interface AuthRouteProps extends RouteProps {
    unauthorized?: boolean;
    roles?: string[];
}

const AuthRoute: React.FC<AuthRouteProps> = (props) => {
    const {
        roles = [],
        unauthorized = false,
        ...rest
    } = props;
    const {current: {user}} = useStore()

    const buildRoute = () => {
        if (!user && !unauthorized) {
            return <Redirect to={"/"}/>;
        }

        if (user && roles.length > 0 && !roles.includes(user.role)) {
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
