import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';
import {Meta} from 'pages/Base/Meta';

export const PasswordMessage: React.FC = () => (
    <>
        <Meta/>
        <InfoCard
            text={[
                "A password reset link has been sent to your email account",
                " ",
                "Note: do not forget to check SPAM folder",
            ]}
        />
    </>
);
