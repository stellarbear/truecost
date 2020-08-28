import * as React from 'react';
import {CSSProperties} from 'react';

interface IBase {
    s?: number;
    fullWidth?: boolean;
    wrap?: boolean;
    style?: CSSProperties;
    p?: number | [number, number];
    m?: number | [number, number];

    width?: (number | string)[];

    onClick?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
    onMouseEnter?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
    onMouseLeave?: ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void);
}

interface IStart extends IBase {
    start: boolean;
}

interface IEnd extends IBase {
    end: boolean;
}

interface IEven extends IBase {
    even: boolean;
}

interface IAround extends IBase {
    around: boolean;
}

interface IBetween extends IBase {
    between: boolean;
}


type IProps = IStart | IEnd | IEven | IAround | IBetween | IBase;

const isStart = (object: IProps): object is IStart => 'start' in object;
const isEnd = (object: IProps): object is IEnd => 'end' in object;
const isEven = (object: IProps): object is IEven => 'even' in object;
const isAround = (object: IProps): object is IAround => 'around' in object;
const isBetween = (object: IProps): object is IBetween => 'between' in object;

export const Row: React.FC<IProps> = (props) => {
    const {
        p = 0, m = 0, s = 0,
        wrap = false,
        fullWidth = false,
        width = [],
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

        return (React.Children.map(children, (child, index) => React.isValidElement(child) && (
            <div key={index} style={{marginRight: s, width: width[index] || "auto"}}>
                {child}
            </div>
        )));
    };

    return (
        <div
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}
            style={{
                width: fullWidth ? "100%" : "auto",
                display: "flex",
                flexWrap: wrap ? "wrap" : "nowrap",
                alignItems: "center",
                margin: Array.isArray(m) ? `${m[0]}px ${m[1]}px` : m,
                padding: Array.isArray(p) ? `${p[0]}px ${p[1]}px` : p,
                justifyContent:
                    isStart(rest) ? "flex-start"
                        : isEnd(rest) ? "flex-end"
                        : isEven(rest) ? "space-evenly"
                            : isAround(rest) ? "space-around"
                                : isBetween(rest) ? "space-between"
                                    : "center",

                ...style,
            }}>
            {renderChildren()}
        </div>
    );
};
