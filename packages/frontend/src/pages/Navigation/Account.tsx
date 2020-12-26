import {Button, Menu, MenuItem} from "@material-ui/core";
import React, {useState} from "react";
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
            {user?.role === RoleType.ADMIN && <AdminPicker />}
            <Button color="inherit" onClick={onLogOut}>
                logout
            </Button>
        </Row>
    );

    return user ? logOut : logIn;
};

const AdminPicker: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <Button color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                admin
            </Button>
            <Menu
                disableScrollLock
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem component={Link} color="inherit" to={'/admin'}>
                    CRUD
                </MenuItem>
                <MenuItem component={Link} color="inherit" to={'/booking/link'}>
                    Direct order
                </MenuItem>
            </Menu >
        </>
    );
};
