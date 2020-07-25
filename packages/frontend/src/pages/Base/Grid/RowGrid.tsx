import * as React from 'react';
import {CSSProperties} from 'react';

interface IProps {
    w: number
    s?: number
    p?: number
    style?: CSSProperties

}

export const RowGrid: React.FC<IProps> = (props) => {
    const {
        w,
        p = 0,
        s = 0,
        style = {},
        children,
    } = props;

    return (
        <div style={{
            ...style,
            margin: -p,
            padding: p,
            display: "grid",
            overflow: "hidden",
            gridTemplateColumns: `repeat(auto-fill, minmax(${w}px, 1fr))`,
            gridRowGap: s,
            gridColumnGap: s,
        }}>
            {children}
        </div>
    )
}
