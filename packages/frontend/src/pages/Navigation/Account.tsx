import {Button, Typography, Container} from "@material-ui/core";
import React, {useContext} from "react";
import {Link, useHistory} from 'react-router-dom';
import {DataContext} from "pages/Data/Wrapper";
import {Col, Row} from "pages/Base/Grid";
import {useStore} from 'pages/Data/Wrapper';
import gql from "graphql-tag";
import {useMutation} from "react-apollo";
import {RoleType} from "@truecost/shared";

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
    }

    const logIn = (
        <Row>
            <Button component={Link} color="inherit" to={'/register'}>
                Register
            </Button>
            <Button component={Link} color="inherit" to={'/login'}>
                Login
            </Button>
        </Row>
    )

    const logOut = (
        <Row>
            <Button component={Link} color="inherit" to={'/account'} disabled>
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
    )

    return !user ? logIn : logOut
}
