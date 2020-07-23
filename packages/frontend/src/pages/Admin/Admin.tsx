import * as React from 'react';
import AuthRoute from "pages/Admin/AuthRoute";
import {Switch} from "react-router-dom";
import {admin} from "pages/Admin/routes";
import {Header} from './Header';
import {RoleType} from '@truecost/shared';


export const Admin = () => {
    return (
        <>
            <Header />
            <Switch>
                {
                    admin.routes.map(({url, component}) =>
                        <AuthRoute exact
                            roles={[RoleType.ADMIN]}
                            key={url}
                            path={`/admin/${url}`}
                            component={component} />)
                }
            </Switch>
        </>
    )
}