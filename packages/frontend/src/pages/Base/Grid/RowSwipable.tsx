import * as React from 'react';
import {CSSProperties} from 'react';
import {IconButton, Hidden} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";

interface IProps {
    id: string;
    w: number;
    s?: number;
    p?: number;
    collapse?: boolean;
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
        collapse = false,
        p = 0, s = 0, w,
        arrows = false,
        children,
    } = props;

    const [visible, setVisibility] = React.useState(false);

    const classes = useStyles();

    const arrowStyle: CSSProperties = {
        opacity: visible ? 1.0 : 0.0,
        transition: "all 0.5s",

        position: "absolute",
        top: "40%",
        zIndex: 2,
        background: "#FFFFFFDD",
    };

    return (
        <div
            onMouseEnter={() => setVisibility(true)}
            onMouseLeave={() => setVisibility(false)}
            style={{
                position: "relative",
            }}>
            <div id={id} className={classes.row} style={{
                ...style,
                display: "grid",
                padding: `${p}px ${p}px`,
                gridGap: s,
                //gridTemplateColumns: w,
                gridAutoFlow: "column",
                gridAutoColumns: collapse ? `${w}px ` : `minmax(${w}px, 1fr)`,
                overflowX: "auto",
            }}>
                {children}
            </div>
            {
                arrows && (
                    <Hidden smDown>
                        <IconButton
                            aria-label="swipe left"
                            style={{
                                ...arrowStyle,
                                left: s + 4,
                            }}
                            onClick={() => {
                                const element = document.getElementById(id);
                                element?.scrollTo(
                                    {left: element.scrollLeft - element.offsetWidth, behavior: "smooth"}
                                );
                            }}>
                            <ArrowBack />
                        </IconButton>
                        <IconButton
                            aria-label="swipe right"
                            style={{
                                ...arrowStyle,
                                right: s + 4,
                            }}
                            onClick={() => {
                                const element = document.getElementById(id);
                                element?.scrollTo(
                                    {left: element.scrollLeft + element.offsetWidth, behavior: "smooth"}
                                );
                            }}>
                            <ArrowForward />
                        </IconButton>
                    </Hidden>
                )
            }
        </div >
    );
};
