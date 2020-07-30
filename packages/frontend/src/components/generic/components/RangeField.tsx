import React, {useEffect, useState} from "react";
import {createStyles, makeStyles, Slider, Theme, Typography} from "@material-ui/core";
import TextField, {BaseTextFieldProps} from "@material-ui/core/TextField";
import {Row, Col} from "../../../pages/Base/Grid";

const useStyles = makeStyles({
    markLabel: {
        marginLeft: -10,
        transform: "rotate(180deg)",
        writingMode: "vertical-rl",
    },
});

interface IProps extends BaseTextFieldProps {
    min?: number;
    max?: number;
    step?: number;
    single?: boolean;
    marks?: {
        value: number;
        label: string;
    }[];
    label: string;
    labelLeft?: string;
    labelRight?: string;
    value: [number, number];
    variant?: "standard" | "outlined" | "filled";
    onChangeEvent: ((value: [number, number]) => void);
}

const RangeField: React.FC<IProps> = (props) => {
    const classes = useStyles();
    const {
        label,
        value,
        min = 0,
        step = 1,
        marks = [],
        max = 4096,
        single = false,
        labelLeft = "",
        labelRight = "",
        variant = "outlined",
        onChangeEvent,
    } = props;

    const parse = (a: any): number => {
        const parsed = parseInt(a, 10)
        const result = parsed || min;

        return Math.min(Math.max(min, result), max)
    }

    const order = ([a, b]: [number, number]): [number, number] => a <= b ? [a, b] : [b, a]

    const validate = ([a, b]: [any, any]) => {
        a = parse(a)
        b = parse(b)

        setState(order([a, b]));
    };

    const [state, setState] = React.useState<[number, number]>(order(value));
    const filteredMarks = marks.filter(({value, label}) => value >= min && value <= max)

    useEffect(() => {
        validate(value);
    }, [value]);

    return (
        <Col fullWidth s={8}
            style={{
                textAlign: "center",
            }}>
            <Row between>
                <TextField
                    disabled={single}
                    margin="dense"
                    type="number"
                    value={state[0]}
                    variant={variant}
                    label={labelLeft}
                    onChange={(event) => validate([event.target.value, state[1]])}
                    onBlur={() => onChangeEvent(state)}
                    inputProps={{
                        style: {textAlign: "center", maxWidth: 80},
                    }} />
                <Typography gutterBottom style={{textAlign: "center", margin: 8, marginTop: 14}}>
                    {label}
                </Typography>
                <TextField
                    margin="dense"
                    type="number"
                    value={state[1]}
                    variant={variant}
                    label={labelRight}
                    onChange={(event) => validate([state[0], event.target.value])}
                    onBlur={() => onChangeEvent(state)}
                    inputProps={{
                        style: {textAlign: "center", maxWidth: 80},
                    }} />
            </Row>
            <Slider
                classes={{ markLabel: classes.markLabel,  }}
                track={"normal"}
                min={min}
                max={max}
                value={single ? state[1] : state}
                step={step}
                onChange={(_, value) =>
                    single ? validate([state[0], value])
                        : Array.isArray(value) && (validate([value[0], value[1]]))}
                onChangeCommitted={() => onChangeEvent(state)}
                marks={filteredMarks}
            />
            <div className={classes.markLabel} style={{visibility: "hidden", marginTop: -30}}>
                {filteredMarks.sort((a, b) => b.label.length - a.label.length)[0].label}
            </div>
        </Col>
    );
};

export default RangeField;
