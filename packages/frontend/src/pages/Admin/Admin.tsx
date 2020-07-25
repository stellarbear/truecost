import * as React from 'react';
import AuthRoute from "pages/Admin/AuthRoute";
import {admin} from "pages/Admin/routes";
import {Header} from './Header';
import {RoleType} from '@truecost/shared';

export const Admin = () => (
    <>
        <Header />
        {
            admin.routes.map(({url, component}) =>
                <AuthRoute exact
                    roles={[RoleType.ADMIN]}
                    key={url}
                    path={`/admin/${url}`}
                    component={component} />)
        }
    </>
)
