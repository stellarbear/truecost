import * as React from 'react';
import {account} from './routes';
import {InnerHeader} from 'pages/Navigation/InnerHeader';
import {Meta} from 'pages/Base/Meta';

export const Account = () => (
    <>
        <Meta/>
        <InnerHeader
            prefix="account"
            routes={account.routes}
        />
    </>
);
