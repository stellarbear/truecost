import {Button} from "@material-ui/core";
import React from "react";
import {Link, useHistory} from 'react-router-dom';
import {useStore} from "pages/Data/Wrapper";
import {Row} from "pages/Base/Grid";
import {RoleType} from "@truecost/shared";
import {account} from "pages/Account/routes";
import {gql, useMutation} from "@apollo/client";

const LOGOUT = gql`
    mutation UserLogout {
        UserLogout
    }
`;

export const Account: React.FC = () => {
    const {current: {user}, update: {setUser}} = useStore();
    const [logoutMutation] = useMutation(LOGOUT);
    const history = useHistory();

    const onLogOut = async () => {
        try {
            await logoutMutation();
        } catch (error) {
            /* suppress */
        } finally {
            setUser(null);
        }
        history.push("/login");
    };

    const logIn = (
        <Row>
            <Button component={Link} color="inherit" to={'/register'}>
                Register
            </Button>
            <Button component={Link} color="inherit" to={'/login'}>
                Login
            </Button>
        </Row>
    );

    const logOut = (
        <Row>
            <Button component={Link} color="inherit" to={'/account/' + account.routes[0].url}>
                account
            </Button>
            {user?.role === RoleType.ADMIN && (
                <Button component={Link} color="inherit" to={'/admin'}>
                    admin
                </Button>
            )}
            <Button color="inherit" onClick={onLogOut}>
                logout
            </Button>
        </Row>
    );

    return user ? logOut : logIn;
};
