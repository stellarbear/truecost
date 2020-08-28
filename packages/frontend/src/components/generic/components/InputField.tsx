import React from "react";
import {TextField} from "@material-ui/core";
import {BaseTextFieldProps} from "@material-ui/core/TextField";
import {useDebounceState} from "auxiliary/useDebounceState";

interface IProps extends BaseTextFieldProps {
    editable?: boolean;
    multiline?: boolean;
    value: string;
    onChangeEvent: ((value: string) => void);
}

export const InputField: React.FC<IProps> = (props) => {
    const {editable, multiline, value, onChangeEvent, ...rest} = props;
    //const {state, setState, bubbleState} = useEventState(value, onChangeEvent);
    const {state, bubbleState} = useDebounceState(value, onChangeEvent);

    return (
        <TextField
            {...rest}
            disabled={!editable}
            multiline={multiline}
            fullWidth
            type="text"
            value={state}
            variant="filled"
            onChange={(event) => bubbleState(event.target.value)}
            //onBlur={() => bubbleState()}
        />
    );
};
