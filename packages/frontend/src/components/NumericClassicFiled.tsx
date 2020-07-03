import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, TextField, Theme, Tooltip, Typography} from "@material-ui/core";
import {BaseTextFieldProps} from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        inner: {
            //verticalAlign: "baseline"
        },
        label: {
            fontSize: "0.7rem",

        },
    }),
);

interface INumericClassicFieldProps extends BaseTextFieldProps {
    min?: number;
    max?: number;
    label: string;
    value: number;
    single?: boolean;
    onChangeEvent: ((value: number) => void);
}

const NumericClassicField = ({
                                 label,
                                 value,
                                 min = -20,
                                 max = 4096,
                                 single = true,
                                 onChangeEvent,
                             }: INumericClassicFieldProps): JSX.Element => {
    const classes = useStyles();
    const [num, setNum] = useState(value);
    const [minus, setMinus] = useState(false);
    const [isEmpty, setEmpty] = useState(false);

    useEffect(() => {
        setNum(value);
    }, [value]);

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

    const onFocusLeave = () => {
        if (isEmpty) {
            setEmpty(false);
            onChangeEvent(min);
            setNum(min);
        }
    };

    return (
        <div>
            <Typography className={classes.label}>{label}</Typography>
            <div className={classes.root}>
                <Tooltip title={`Set ${label}`} placement="bottom">
                    <TextField
                        type="number"
                        onBlur={onFocusLeave}
                        value={isEmpty ? "" : (minus ? "-" : num)}
                        onChange={onInputChange}
                        className={classes.inner}
                    />
                </Tooltip>
            </div>
        </div>
    );
};

export default NumericClassicField;
