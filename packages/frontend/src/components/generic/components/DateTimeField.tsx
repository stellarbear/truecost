import * as React from "react";
import {DateTimePicker, DateTimePickerProps} from "@material-ui/pickers";
import {useEventState} from "../useEventState";
import {TextField, BaseTextFieldProps} from "@material-ui/core";

export type IDateTimePickerType = "datetime-local" | "date" | "time";

interface IProps extends BaseTextFieldProps {
    type: IDateTimePickerType
    label?: string;
    value: Date;
    onChangeEvent: ((value: Date) => void);
}

export const DateTimeField: React.FC<IProps> = (props) => {
    const {
        label,
        value,
        type,
        onChangeEvent,
        ...rest
    } = props;
    const {state, setAndBubbleState} = useEventState(value, onChangeEvent);

    return (
        <TextField
            fullWidth
            {...rest}
            type={type}
            label={label}
            value={value}
            onChange={(event) => {
                setAndBubbleState(new Date(event.target.value));
            }}
        />
    );
};

export default DateTimeField;
