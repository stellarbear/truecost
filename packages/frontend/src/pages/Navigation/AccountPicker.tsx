import {Badge, IconButton, Menu, MenuItem} from "@material-ui/core";
import React, {useState} from "react";
import {Link, useHistory} from 'react-router-dom';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {useStore} from 'pages/Data/Wrapper';
import {gql, useMutation} from '@apollo/client';
import {RoleType} from "@truecost/shared";
import {account} from "pages/Account/routes";

const LOGOUT = gql`
    mutation UserLogout {
        UserLogout
    }
`;

export const AccountPicker: React.FC = () => {
    const {current: {user, discount}, update: {setUser}} = useStore();
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
    };

    const logIn = (
        [
            <MenuItem key={'register'} component={Link} color="inherit" to={'/register'}>
                Register
            </MenuItem>,
            <MenuItem key={'login'} component={Link} color="inherit" to={'/login'}>
                Login
            </MenuItem>,
        ]
    );

    const logOut = (
        [
            <MenuItem key={'account'}  component={Link} color="inherit" to={'/account/' + account.routes[0].url}>
                account
            </MenuItem>,
            user?.role === RoleType.ADMIN && (
                <MenuItem component={Link} color="inherit" to={'/admin'}>
                    admin
                </MenuItem>
            ),
            <MenuItem key={'logout'}  color="inherit" onClick={onLogOut}>
                logout
            </MenuItem>,
        ]
    );

    return (
        <>
            <IconButton color="inherit" aria-haspopup="true" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={discount > 0 ? `${discount}\u00A0%` : 0} color="secondary">
                    <AccountCircle />
                </Badge>
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
    );
};
