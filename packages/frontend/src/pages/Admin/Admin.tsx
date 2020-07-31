import * as React from 'react';
import {admin} from "pages/Admin/routes";
import {InnerHeader} from 'pages/Navigation/InnerHeader';

export const Admin = () => (
    <InnerHeader
        prefix="admin"
        routes={admin.routes}
        base={admin.routes[0].url}
    />
)
