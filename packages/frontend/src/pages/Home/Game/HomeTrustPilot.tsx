import * as React from 'react';
import {Paper} from '@material-ui/core';
import {TrustBox} from 'pages/Base/TrustBox';

export const HomeTrustPilot: React.FC = () => (
    <Paper elevation={6} style={{
        height: "100%",
    }}>
            <TrustBox size="big"/>
    </Paper>
);
