import React, {CSSProperties, useEffect, useState} from "react";
import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import {BaseTextFieldProps} from "@material-ui/core/TextField";
import {useEventState} from "../../../auxiliary/useEventState";

interface IProps extends BaseTextFieldProps {
    editable?: boolean;
    multiline?: boolean;
    value: string;
    onChangeEvent: ((value: string) => void);
}

export const InputField: React.FC<IProps> = (props) => {
    const {editable, multiline, value, onChangeEvent, ...rest} = props;
    const {state, setState, bubbleState} = useEventState(value, onChangeEvent);

    return (
        <TextField
            {...rest}
            disabled={!editable}
            fullWidth
            type="text"
            value={state}
            variant="filled"
            onChange={(event) => setState(event.target.value)}
            onBlur={() => bubbleState()}
        />
    );
};
