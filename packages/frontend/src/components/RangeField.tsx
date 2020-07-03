import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Slider, Theme, Typography} from "@material-ui/core";
import TextField, {BaseTextFieldProps} from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
        },
        outer: {
            padding: "0px 8px",
            maxWidth: 200,
        },
    }),
);

interface IRangeFieldProps extends BaseTextFieldProps {
    min?: number;
    max?: number;
    step?: number;
    marks?: {
        value: number;
        label: string;
    }[];
    label: string;
    labelLeft?: string;
    labelRight?: string;
    value: number[];
    single?: boolean;
    showMarks?: boolean;
    debounceTimer?: number;
    variant?: "standard" | "outlined" | "filled";
    onChangeEvent: ((value: number[]) => void);
}

const RangeField = ({
                        label,
                        value,
                        min = 0,
                        step = 1,
                        marks = [],
                        max = 4096,
                        labelLeft = "",
                        labelRight = "",
                        single = true,
                        showMarks = false,
                        debounceTimer = 500,
                        variant = "outlined",
                        onChangeEvent,
                    }: IRangeFieldProps): JSX.Element => {
    const classes = useStyles();
    const [state, setState] = React.useState(value);
    const [minus, setMinus] = useState([false, false]);
    const [empty, setEmpty] = useState([false, false]);
    const [timerId, setTimerId] = React.useState<NodeJS.Timeout>();

    useEffect(() => {
        setState(value);
        setEmpty([false, false]);
    }, [value]);

    const onStateChange = (value: number[]): void => {
        if (timerId) {
            global.clearTimeout(timerId);
        }

        setState(value);

        const timer = setTimeout(() => onChangeEvent(value.map(v => validateRange(v))), debounceTimer);
        setTimerId(timer);
    };

    const validateRange = (value: number) => {
        if (value <= min) {
            return min;
        }
        if (value >= max) {
            return max;
        }
        return value;
    };

    const update = (index: number, arr: any[], value: any) => {
        const result = [...arr];
        result[index] = value;
        return result;
    };

    const validateState = (newState: number[]) => newState[0] <= newState[1] ? newState : [newState[0], newState[0]];

    const onInputChange = (value: string, index: number) => {
        const u = (arr: any[], value: any) => update(index, arr, value);

        setMinus(u(minus, false));
        setEmpty(u(empty, false));
        if (value == "") {
            setEmpty(u(empty, true));
            onStateChange(u(state, 0));
        } else if (value == "-") {
            setMinus(u(minus, true));
            onStateChange(u(state, 0));
        } else if (single) {
            if (/^-?\d*$/.test(value)) {
                const num = (parseInt(value, 10));

                onStateChange(u(state, num));
            }
        } else if (!single) {
            if (/^-?\d*\.?\d*$/.test(value)) {
                const num = (parseFloat(value));

                onStateChange(u(state, num));
            }
        }
    };

    const onBothInputChange = (value: [number, number]) => {
        const v = validateState;

        onStateChange(v(value));
    };

    const left = empty[0] ? "" : (minus[0] ? "-" : state[0]);
    const right = empty[1] ? "" : (minus[1] ? "-" : state[1]);

    return (
        <div className={classes.outer}>
            <Typography gutterBottom style={{textAlign: "center", margin: 8, marginTop: 14}}>
                {label}
            </Typography>
            <div style={{
                display: "flex",
                justifyContent: "space-between", alignItems: "center",
            }}>
                <TextField
                    margin="dense"
                    type="number"
                    value={left}
                    variant={variant as any}
                    label={labelLeft}
                    onKeyDown={(evt) => single && ["e", "."].includes(evt.key) && evt.preventDefault()}
                    onChange={(event) => onInputChange(event.target.value, 0)}
                    onBlur={() => left === ""
                        ? onInputChange('' + min, 1)
                        : onBothInputChange([parseInt((left as any), 10), parseInt((right as any), 10)])}
                    inputProps={{
                        style: {textAlign: "center"},
                        min: '' + min,
                        max: '' + max,
                        step: '' + step,
                    }}/>

                <TextField
                    margin="dense"
                    type="number"
                    value={right}
                    variant={variant as any}
                    label={labelRight}
                    onKeyDown={(evt) => single && ["e", "."].includes(evt.key) && evt.preventDefault()}
                    onChange={(event) => onInputChange(event.target.value, 1)}
                    onBlur={() => right === ""
                        ? onInputChange('' + max, 1)
                        : onBothInputChange([parseInt((left as any), 10), parseInt((right as any), 10)])}
                    inputProps={{
                        style: {textAlign: "center"},
                        min: '' + min,
                        max: '' + max,
                        step: '' + step,
                    }}/>
            </div>
            <Slider
                style={{marginTop: 8}}
                min={min}
                max={max}
                value={state}
                step={step}
                onChange={(event, value) => onBothInputChange([value[0], value[1]])}
                marks={showMarks ? (marks.filter(({value, label}) => value >= min && value <= max)) : []}
            />
        </div>
    );
};

export default RangeField;
