import * as React from 'react';
import AuthRoute from "pages/Admin/AuthRoute";
import {admin} from "pages/Admin/routes";
import {account} from './routes';
import {InnerHeader} from 'pages/Navigation/InnerHeader';

export const Account = () => (
    <InnerHeader
        prefix="account"
        routes={account.routes}
        base={account.routes[0].url}
    />
)
