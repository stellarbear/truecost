import * as React from 'react';
import {Hidden} from '@material-ui/core';

const shared: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "#FFFFFFEE",
    borderRadius: 6,
    height: "100%",
    zIndex: -1,
};

export const HomeCurtain: React.FC = () => (
    <>
        <Hidden smDown>
            <div style={{
                ...shared,
                left: -32,
                right: -32,
            }} />
        </Hidden>
        <Hidden mdUp>
            <div style={{
                ...shared,
                left: -16,
                right: -16,
            }} />
        </Hidden>
    </>
);