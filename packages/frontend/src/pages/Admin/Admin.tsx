import * as React from 'react';
import {admin} from "pages/Admin/routes";
import {InnerHeader} from 'pages/Navigation/InnerHeader';
import {NoSsr} from '@material-ui/core';

export const Admin = () => (
    <NoSsr>
        <InnerHeader
            scroll
            prefix="admin"
            routes={admin.routes}
        />
    </NoSsr>
);
