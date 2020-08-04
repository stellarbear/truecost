import * as React from 'react';
import {Card, ButtonBase, Paper} from '@material-ui/core';
import TrustBox from 'pages/Base/TrustBox';
import {CSSProperties} from 'react';

export const HomeTrustPilot: React.FC = () => (
    <Paper elevation={6} style={{
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <ButtonBase>
            <TrustBox size="big" />
        </ButtonBase>
    </Paper>
)
