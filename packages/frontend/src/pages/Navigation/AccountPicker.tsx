import {Button, Typography, Container, IconButton, Menu, MenuItem} from "@material-ui/core";
import React, {useContext, useState} from "react";
import {Link, useHistory} from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Col, Row} from "pages/Base/Grid";
import {useStore} from 'pages/Data/Wrapper';
import gql from "graphql-tag";
import {useMutation} from "react-apollo";
import {RoleType} from "@truecost/shared";
import {account} from "pages/Account/routes";

const LOGOUT = gql`
    mutation UserLogout {
        UserLogout
    }
`;

export const AccountPicker: React.FC = () => {
    const {current: {user}, update: {setUser}} = useStore();
    const [logoutMutation] = useMutation(LOGOUT);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
        [
            <MenuItem component={Link} color="inherit" to={'/register'}>
                Register
            </MenuItem>,
            <MenuItem component={Link} color="inherit" to={'/login'}>
                Login
            </MenuItem>
        ]
    )

    const logOut = (
        [
            <MenuItem component={Link} color="inherit" to={'/account/' + account.routes[0].url}>
                account
            </MenuItem>,
            user?.role === RoleType.ADMIN && (
                <MenuItem component={Link} color="inherit" to={'/admin'}>
                    admin
                </MenuItem>
            ),
            <MenuItem color="inherit" onClick={onLogOut}>
                logout
            </MenuItem>
        ]
    )

    return (
        <>
            <IconButton color="inherit" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <AccountCircle />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {React.Children.map(user ? logOut : logIn,
                    (child, index) => React.isValidElement(child) &&
                        React.cloneElement(child, {key: index}))}
            </Menu>
        </>
    )
}
