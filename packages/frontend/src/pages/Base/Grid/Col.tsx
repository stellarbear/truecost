import * as React from 'react';
import {Grid} from '@material-ui/core';

interface IBase {
    spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
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

export const Col: React.FC<IProps> = ({children, spacing = 0, ...rest}) => {
    const renderChildren = () => {
        if (!children) {
            return null;
        }

        return (React.Children.map(children, child => (
            <Grid container item >
                {child}
            </Grid>
        )))
    }

    return (
        <Grid
            container
            spacing={spacing}
            style={{
                display: "flex",
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