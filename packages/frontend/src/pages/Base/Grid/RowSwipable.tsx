import * as React from 'react';
import {CSSProperties} from 'react';
import {IconButton} from '@material-ui/core';
import ArrowBack from "@material-ui/icons/ArrowBack";
import ArrowForward from "@material-ui/icons/ArrowForward";
import {useRandState} from 'auxiliary/useRandState';

interface IProps {
    w: number
    s?: number
    p?: number
    style?: CSSProperties
}

export const RowSwipable: React.FC<IProps> = (props) => {
    const {
        style = {},
        p = 0, s = 0, w,
        children,
    } = props;

    const [id] = useRandState(16);

    return (
        <div style={{
            marginBottom: -32,
            overflow: "hidden",
            position: "relative",
        }}>
            <div id={id} style={{
                ...style,
                display: "grid",
                padding: p,
                gridGap: s,
                gridTemplateColumns: w,
                gridAutoFlow: "column",
                gridAutoColumns: `minmax(${w}px, 1fr)`,
                overflowX: "scroll",
            }}>
                {children}
            </div >
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
                    )
                }}>
                <ArrowBack />
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
                    )
                }}>
                <ArrowForward />
            </IconButton>
        </div>
    )
}
