import * as React from 'react';
import {Grid} from '@material-ui/core';
import {CSSProperties} from '@material-ui/core/styles/withStyles';

interface IBase {
    spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
    fullWidth?: boolean
    style?: CSSProperties
    padding?: number
    margin?: number
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
    const {children,
        padding = 0, margin = 0, spacing = 0,
        fullWidth = false,
        style = {},
        ...rest} = props;

    const renderChildren = () => {
        if (!children) {
            return null;
        }

        return (React.Children.map(children, child => React.isValidElement(child) && (
            <Grid item style={{
                width: fullWidth ? "100%" : "auto",
            }}>
                {child}
            </Grid>
        )))
    }

    return (
        <Grid
            container
            spacing={spacing}
            style={{
                ...style,
                display: "flex",
                padding, margin,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: isLeft(rest)
                    ? "flex-Left"
                    : isRight(rest) ?
                        "flex-Right" : "center"
            }}>
            {renderChildren()}
        </Grid>
    )
}