import * as React from 'react';
import {ButtonBase, Paper} from '@material-ui/core';
import TrustBox from 'pages/Base/TrustBox';

export const HomeTrustPilot: React.FC = () => (
    <Paper elevation={6} style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <ButtonBase>
            <TrustBox size="big"/>
        </ButtonBase>
    </Paper>
);
