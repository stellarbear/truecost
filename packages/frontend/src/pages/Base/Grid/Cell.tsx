import * as React from 'react';

type OnMouseEvent = React.MouseEvent<HTMLDivElement, MouseEvent>;

type Justify =
    "flex-start" |
    "flex-end" |
    "space-evenly" |
    "space-around" |
    "space-between" |
    "center";

type Align =
    "stretch" |
    "flex-start" |
    "flex-end" |
    "normal" |
    "center"
    ;

type Direction =
    "row" | "column";

interface IProps {
    s?: number;
    p?: number | [number, number];
    m?: number | [number, number];

    wrap?: boolean;
    fullWidth?: boolean;
    style?: React.CSSProperties;

    align?: Align;
    justify?: Justify;
    direction?: Direction;

    onClick?: ((event: OnMouseEvent) => void);
    onMouseEnter?: ((event: OnMouseEvent) => void);
    onMouseLeave?: ((event: OnMouseEvent) => void);
}

const Cell: React.FC<IProps> = (props) => {
    const {
        p, m, s,
        wrap = false,
        fullWidth = false,
        direction,
        style = {},
        children,
        align,
        justify,
        onMouseEnter,
        onMouseLeave,
        onClick,
        ...rest

    } = props;

    const renderChildren = () => {
        if (!children) {
            return null;
        }

        const length = React.Children.count(children);

        return (
            React.Children.map(children, (child, index) => React.isValidElement(child) && (
                <>
                    {child}
                    {s && (index < length - 1) && <div style={{height: s, width: s}} />}
                </>
            )));
    };

    return (
        <div
            onClick={onClick}
            onMouseLeave={onMouseLeave}
            onMouseEnter={onMouseEnter}

            style={{
                width: fullWidth ? "100%" : undefined,
                display: "flex",
                alignItems: align,
                justifyContent: justify,
                flexWrap: wrap ? "wrap" : undefined,
                flexDirection: direction,
                margin: m && (Array.isArray(m)
                    ? `${m[0]}px ${m[1]}px` : m),
                padding: p && (Array.isArray(p)
                    ? `${p[0]}px ${p[1]}px` : p),
                ...style,
                ...rest,
            }}
        >
            {renderChildren()}
        </div>
    );
};

export const Row: React.FC<Omit<IProps, 'direction'>> = (props) => (
    <Cell
        {...props} />
);


export const Col: React.FC<Omit<IProps, 'direction'>> = (props) => (
    <Cell
        {...props}
        direction="column" />
);