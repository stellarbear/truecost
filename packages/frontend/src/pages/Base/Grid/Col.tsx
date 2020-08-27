import * as React from 'react';
import {Grid} from '@material-ui/core';
import {CSSProperties} from 'react';

interface IBase {
    s?: number
    fullWidth?: boolean
    style?: CSSProperties
    p?: number | [number, number]
    m?: number | [number, number]

    onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
    onMouseEnter?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
    onMouseLeave?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
}

interface ILeft extends IBase {
    left: boolean;
}

interface IRight extends IBase {
    right: boolean;
}


type IProps = ILeft | IRight | IBase

const isLeft = (object: IProps): object is ILeft => 'left' in object;
const isRight = (object: IProps): object is IRight => 'right' in object;

export const Col: React.FC<IProps> = (props) => {
    const {
        p = 0, m = 0, s = 0,
        fullWidth = false,
        style = {},
        children,
        onMouseEnter,
        onMouseLeave,
        onClick,
        ...rest
    } = props;

    const renderChildren = () => {
        if (!children) {
            return null;
        }

        return (React.Children.map(children, child => React.isValidElement(child) && (
            <div style={{width: fullWidth ? "100%" : "auto", marginBottom: s}}>
                {child}
            </div>
        )))
    }

    return (
        <div
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
            style={{
                display: "flex",
                margin: Array.isArray(m) ? `${m[0]}px ${m[1]}px` : m,
                padding: Array.isArray(p) ? `${p[0]}px ${p[1]}px` : p,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: isLeft(rest)
                    ? "flex-start"
                    : isRight(rest) ?
                        "flex-end" : "center",
                ...style,
            }}>
            {renderChildren()}
        </div>
    )
}
