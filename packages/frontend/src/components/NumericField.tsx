import React, {useEffect, useState} from "react";
import {createStyles, IconButton, makeStyles, TextField, Theme, Typography} from "@material-ui/core";
import {ChevronLeft, ChevronRight} from "@material-ui/icons";
import {BaseTextFieldProps} from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        outer: {
            display: "inline-flex",
        },
        inner: {
            width: 40,
            verticalAlign: "baseline",
        },
        label: {
            textAlign: "center",
            fontSize: "0.7rem",
            paddingTop: 8,
        },
    }),
);

interface INumericFieldProps extends BaseTextFieldProps {
    min?: number;
    max?: number;
    label: string;
    value: number | null;
    single?: boolean;
    onChangeEvent: ((value: number) => void);
}

const NumericField = ({
                          label,
                          value,
                          min = -20,
                          max = 4096,
                          single = true,
                          onChangeEvent,
                      }: INumericFieldProps): JSX.Element => {
    const classes = useStyles();
    const [num, setNum] = useState(value);
    const [minus, setMinus] = useState(false);
    const [isEmpty, setEmpty] = useState(false);

    useEffect(() => setNum(value), [value]);

    const [timerID, setTimerID] = React.useState<NodeJS.Timeout>();

    const validateRange = (value: number) => {
        if (value <= min) {
            return min;
        }
        if (value >= max) {
            return max;
        }
        return value;
    };

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setMinus(false);
        setEmpty(false);
        if (value == "") {
            setEmpty(true);
            onChangeEvent(0);
            setNum(0);
        } else if (value == "-") {
            setMinus(true);
            onChangeEvent(0);
            setNum(0);
        } else if (single) {
            if (/^-?\d*$/.test(value)) {
                const num = validateRange(parseInt(value, 10));

                onChangeEvent(num);
                setNum(num);
            }
        } else if (!single) {
            if (/^-?\d*\.?\d*$/.test(value)) {
                const num = validateRange(parseFloat(value));

                onChangeEvent(num);
                setNum(num);
            }
        }
    };

    const onButtonIncrementClick = () => {
        const number = validateRange(num == null ? min : num + 1);
        onChangeEvent(number);
        setNum(number);
    };


    const onButtonDecrementClick = () => {
        const number = validateRange(num == null ? min : num - 1);
        onChangeEvent(number);
        setNum(number);
    };

    const onFocusLeave = () => {
        if (isEmpty) {
            setEmpty(false);
            onChangeEvent(min);
            setNum(min);
        }
    };


    const clearTimer = () => {
        if (timerID) {
            global.clearInterval(timerID);
            setTimerID(undefined);
        }
    };

    const onButtonRelease = () => {
        clearTimer();
    };

    const onButtonIncrementPress = () => {
        let value = num;
        clearTimer();

        const timer = global.setInterval(() => {
            setNum(validateRange(value == null ? min : ++value));
        }, 128);
        setTimerID(timer);
    };

    const onButtonDecrementPress = () => {
        let value = num;
        clearTimer();

        const timer = global.setInterval(() => {
            setNum(validateRange(value == null ? min : --value));
        }, 128);
        setTimerID(timer);
    };

    return (
        <div
            style={{
                height: 60,
                width: "100%",
                textAlign: "center",
            }}>
            <Typography className={classes.label}>{label}</Typography>
            <div className={classes.outer}>
                <IconButton disabled={num == null ? true : (num > min) ? false : true}
                            onMouseDown={() => onButtonDecrementPress()}
                            onMouseUp={() => onButtonRelease()}
                            onClick={() => onButtonDecrementClick()}
                >
                    <ChevronLeft/>
                </IconButton>
                <TextField
                    onBlur={onFocusLeave}
                    value={isEmpty ? "" : (minus ? "-" : num == null ? "" : num)}
                    onChange={onInputChange}
                    className={classes.inner}
                    inputProps={{style: {textAlign: 'center'}}}
                    InputProps={{style: {height: 35}}}
                />
                <IconButton disabled={num == null ? false : (num < max) ? false : true}
                            onMouseDown={() => onButtonIncrementPress()}
                            onMouseUp={() => onButtonRelease()}
                            onClick={() => onButtonIncrementClick()}
                >
                    <ChevronRight/>
                </IconButton>
            </div>
        </div>

    );
};

export default NumericField;
