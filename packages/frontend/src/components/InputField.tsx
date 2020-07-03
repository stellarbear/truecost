import React, {CSSProperties, useEffect, useState} from "react";
import {IconButton, InputAdornment, TextField} from "@material-ui/core";
import {BaseTextFieldProps} from "@material-ui/core/TextField";

interface IInputFieldProps extends BaseTextFieldProps {
    force?: any;
    rtl?: boolean;
    editable?: boolean;
    inputStyle?: CSSProperties;
    adornment?: JSX.Element | null;
    debounceTimer?: number;
    onChangeEvent: ((value: string) => void);
}

const InputField = ({
                        force = false,
                        rtl = false,
                        editable = true,
                        disabled = false,
                        inputStyle = {},
                        adornment = null,
                        debounceTimer = 500,
                        onChangeEvent,
                        ...rest
                    }: IInputFieldProps): JSX.Element => {
    const [state, setState] = useState(rest.value);
    const [timerId, setTimerId] = React.useState<NodeJS.Timeout>();

    useEffect(() => setState(rest.value), [rest.value]);
    useEffect(() => setState(rest.value), [force]);

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if (timerId) {
            global.clearTimeout(timerId);
        }

        const {value} = event.target;
        setState(value);

        if (debounceTimer > 0) {
            const timer = setTimeout(() => onChangeEvent(value), debounceTimer);
            setTimerId(timer);
        } else {
            onChangeEvent(value);
        }
    };

    return (
        <TextField
            {...rest}
            disabled={!editable}
            fullWidth
            type="text"
            value={state}
            variant="filled"
            onChange={onInputChange}
            InputProps={{
                style: rest.multiline ? ({...inputStyle}) : ({height: 60, ...inputStyle}),
                endAdornment: adornment == null
                    ? null
                    : (<InputAdornment position={rtl ? "start" : "end"}>
                        <IconButton
                            tabIndex={-1}
                        >
                            {adornment}
                        </IconButton>
                    </InputAdornment>),
            }}
        />
    );
};

export default InputField;
