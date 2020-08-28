import * as React from 'react';
import {CSSProperties} from 'react';
import {IconButton, makeStyles} from '@material-ui/core';
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";

interface IProps {
    id: string;
    w: number;
    s?: number;
    p?: number;
    style?: CSSProperties;
    arrows?: boolean;
}

const useStyles = makeStyles({
    row: {
        '&::-webkit-scrollbar': {
            height: 0,
        },
    },
});

export const RowSwipable: React.FC<IProps> = (props) => {
    const {
        id,
        style = {},
        p = 0, s = 0, w,
        arrows = false,
        children,
    } = props;

    const classes = useStyles();

    return (
        <div style={{
            position: "relative",
        }}>
            <div id={id} className={classes.row} style={{
                ...style,
                display: "grid",
                padding: p,
                gridGap: s,
                gridTemplateColumns: w,
                gridAutoFlow: "column",
                gridAutoColumns: `minmax(${w}px, 1fr)`,
                overflowX: "auto",
            }}>
                {children}
            </div>
            {arrows && (
                <>
                    <IconButton
                        style={{
                            position: "absolute",
                            top: "40%",
                            left: s + 4,
                            zIndex: 2,
                            background: "#FFFFFFDD",
                        }}
                        onClick={() => {
                            const element = document.getElementById(id);
                            element?.scrollTo(
                                {left: element.scrollLeft - element.offsetWidth, behavior: "smooth"}
                            );
                        }}>
                        <ArrowBack/>
                    </IconButton>
                    <IconButton
                        style={{
                            position: "absolute",
                            top: "40%",
                            right: s + 4,
                            zIndex: 2,
                            background: "#FFFFFFDD",
                        }}
                        onClick={() => {
                            const element = document.getElementById(id);
                            element?.scrollTo(
                                {left: element.scrollLeft + element.offsetWidth, behavior: "smooth"}
                            );
                        }}>
                        <ArrowForward/>
                    </IconButton>
                </>
            )}
        </div>
    );
};
