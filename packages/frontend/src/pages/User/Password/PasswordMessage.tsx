import * as React from 'react';
import {InfoCard} from 'pages/Base/InfoCard';

export const PasswordMessage: React.FC = () => (
    <InfoCard
        text={[
            "A password reset link has been sent to your email account",
            " ",
            "Note: do not forget to check SPAM folder"
        ]}
    />
)
