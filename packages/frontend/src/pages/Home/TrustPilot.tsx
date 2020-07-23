import * as React from 'react';
import {Card, ButtonBase} from '@material-ui/core';
import TrustBox from 'pages/Base/TrustBox';
import {CSSProperties} from 'react';

interface IProps {
    style?: CSSProperties
}

export const TrustPilot: React.FC<IProps> = ({style = {}}) => (
    <Card style={{
        ...style,
        minHeight: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <ButtonBase>
            <TrustBox size="big"/>
        </ButtonBase>
    </Card>
)
