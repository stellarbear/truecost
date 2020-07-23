import * as React from "react";
import {Hidden, IconButton} from "@material-ui/core";
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

interface RowProps {
    style?: CSSProperties;
    id: string;
}

export const SlideRow: React.FC<RowProps> = ({
                                                 id,
                                                 children,
                                                 style = {},
                                             }) => {

    return (
        <React.Fragment>
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ...style,
                }}>
                <Hidden xsDown>
                    <IconButton style={{marginLeft: 2}} onClick={() => {
                        const element = document.getElementById(id);
                        element?.scrollTo(
                            {left: element.scrollLeft - element.offsetWidth, behavior: "smooth"}
                        );
                    }}>
                        <ArrowBack/>
                    </IconButton>
                </Hidden>
                <div id={id} style={{
                    display: "grid",
                    overflow: "auto",
                    gridAutoFlow: "column",
                    gridRowGap: 0,
                    gridColumnGap: 0,
                    justifyItems: "center",
                    padding: "20px 0px",
                    marginBottom: -18,
                }}>
                    {children}
                </div>
                <Hidden xsDown>
                    <IconButton style={{marginRight: 2}} onClick={() => {
                        const element = document.getElementById(id);
                        element?.scrollTo(
                            {left: element.scrollLeft + element.offsetWidth, behavior: "smooth"}
                        );
                    }}>
                        <ArrowForward/>
                    </IconButton>
                </Hidden>
            </div>
        </React.Fragment>
    );
};
