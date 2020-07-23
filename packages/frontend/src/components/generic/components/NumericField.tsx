import React, {useEffect, useState} from "react";
import {createStyles, IconButton, makeStyles, TextField, Theme, Typography} from "@material-ui/core";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import {BaseTextFieldProps} from "@material-ui/core/TextField";
import {Col, Row} from "pages/Base/Grid";
import {useEventState} from "../../../auxiliary/useEventState";

interface IProps extends BaseTextFieldProps {
    min?: number;
    max?: number;
    label?: string;
    value: number;
    onChangeEvent: ((value: number) => void);
}

export const NumericField: React.FC<IProps> = (props) => {
    const {
        label,
        value,
        min = 0,
        max = 4096,
        onChangeEvent,
    } = props;
    const {state, setState, bubbleState, setAndBubbleState} = useEventState(value, onChangeEvent);

    const validate = (value: any) =>
        Math.min(Math.max(min, parseInt(value, 10)), max);

    return (
        <Col>
            {label && <Typography>{label}</Typography>}
            <Row>
                <IconButton disabled={state == min}
                    onClick={() => setAndBubbleState(validate(state - 1))}
                >
                    <ChevronLeft />
                </IconButton><TextField
                    margin="dense"
                    type="number"
                    value={state}
                    variant="filled"
                    label={label}
                    onChange={(event) => setState(validate(event.target.value))}
                    onBlur={() => bubbleState()}
                    inputProps={{
                        style: {textAlign: "center", maxWidth: 80},
                    }} />
                <IconButton disabled={state == max}
                    onClick={() => setAndBubbleState(validate(state + 1))}
                >
                    <ChevronRight />
                </IconButton>
            </Row>
        </Col>

    );
};