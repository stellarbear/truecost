import {Hidden} from "@material-ui/core";
import * as React from "react";

export const OnlyDesktop: React.FC = ({children}) => (
    <Hidden mdDown>
        {children}
    </Hidden>
);

export const OnlyMobile: React.FC = ({children}) => (
    <Hidden lgUp>
        {children}
    </Hidden>
);
