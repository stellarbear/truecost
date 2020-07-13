import * as React from 'react';
import {Grid} from '@material-ui/core';

interface IBase {
    spacing?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
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


type IProps = IStart | IEnd | IEven | IAround | IBetween | IBase

const isStart = (object: IProps): object is IStart => 'start' in object;
const isEnd = (object: IProps): object is IEnd => 'end' in object;
const isEven = (object: IProps): object is IEven => 'even' in object;
const isAround = (object: IProps): object is IAround => 'around' in object;
const isBetween = (object: IProps): object is IBetween => 'between' in object;

export const Row: React.FC<IProps> = ({children, spacing = 2, ...rest}) => {
    const renderChildren = () => {
        if (!children) {
            return null;
        }

        return (React.Children.map(children, child => (
            <Grid item>
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
                alignItems: "center",
                justifyContent:
                    isStart(rest) ? "flex-start"
                        : isEnd(rest) ? "flex-end"
                            : isEven(rest) ? "space-evenly"
                                : isAround(rest) ? "space-around"
                                    : isBetween(rest) ? "space-between"
                                        : "center"
            }}>
            {renderChildren()}
        </Grid>
    )
}