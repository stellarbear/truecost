import * as React from "react";
import {Divider, IconButton, Menu, MenuItem} from "@material-ui/core";
import gql from "graphql-tag";
import {useMutation} from "react-apollo";
import {Link, withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {AccountCircle} from "@material-ui/icons";
import {DataContext} from "pages/Data/Wrapper";
import {admin} from "pages/Admin/routes";

const LOGOUT = gql`
    mutation UserLogout {
        UserLogout
    }
`;

type IAccountPickerProps = RouteComponentProps;

const AccountPicker: React.FC<IAccountPickerProps> = ({history}): JSX.Element => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const {update: {setUser}, current: {user}} = React.useContext(DataContext);
    const [logoutMutation] = useMutation(LOGOUT);

    function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    const onLogout = async () => {
        handleClose();
        try {
            await logoutMutation();
        } catch (error) {
            /* suppress */
        } finally {
            setUser(null);
        }
        history.push("/login");
    };

    const buildMenuItem = (name: string | null) => {
        if (name === null) {
            return <Divider />;
        }
        return (
            <MenuItem
                key={`menu-admin-${name}`}
                component={Link} to={`/admin/${name.toLowerCase()}`}
                onClick={() => handleClose()}
            >{name}</MenuItem>
        );
    };

    const renderAnonym = () => {
        return ([
            <MenuItem component={Link} to="/login" key={`menu-login`} onClick={() => handleClose()}>Log in</MenuItem>,
            <MenuItem component={Link} to="/register" key={`menu-register`}
                onClick={() => handleClose()}>Register</MenuItem>,
        ]);
    };

    const renderUser = () => {
        if (!user) {
            return null;
        }

        return ([
            <MenuItem component={Link} to="/account" key={`menu-myaccount`}>Account</MenuItem>,
            //<Divider />,
            user.role.includes('ADMIN')
                ? admin.routes.map(({url}) => buildMenuItem(url))
                : null,
            //	? [null, "user", "pass", "order", null, "ad", "blog", "category", "item", "option", "tag", null].map(route => buildMenuItem(route))
            //<Divider />,
            <MenuItem key={`menu-logout`} onClick={() => onLogout()}>Log out</MenuItem>,
        ]);
    };

    const renderAccountPicker = () => {
        return (
            <React.Fragment>
                <IconButton
                    color="inherit"
                    onClick={handleClick}
                    aria-haspopup="true"
                    aria-controls="simple-menu">
                    <AccountCircle />
                </IconButton>
                <Menu
                    keepMounted
                    disableScrollLock
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    open={Boolean(anchorEl)}
                >
                    {
                        user
                            ? renderUser()
                            : renderAnonym()
                    }
                </Menu>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            {renderAccountPicker()}
        </React.Fragment>
    );
};

export default withRouter(AccountPicker);
