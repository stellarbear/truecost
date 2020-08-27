import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Meta} from 'pages/Base/Meta';

export const RegisterMessage: React.FC = () => (
    <>
        <Meta />
        <InfoCard
            text={[
                "A verification link has been sent to your email account",
                "Once your account is verified, you will be able to log in",
                " ",
                "Note: do not forget to check SPAM folder"
            ]}
        />
    </>
)
