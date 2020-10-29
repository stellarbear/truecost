import * as React from 'react';
import {Paper} from '@material-ui/core';
import {TrustBox} from 'pages/Base/TrustBox';

export const HomeTrustPilot: React.FC = () => (
    <Paper elevation={6} style={{
        overflow: "overlay",
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
            <TrustBox size="mikro"/>
    </Paper>
);
