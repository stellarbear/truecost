import * as React from "react";
import {useEventState} from "../../../auxiliary/useEventState";
import {BaseTextFieldProps, TextField} from "@material-ui/core";

export type IDateTimePickerType = "datetime-local" | "date" | "time";

interface IProps extends BaseTextFieldProps {
    type: IDateTimePickerType;
    label?: string;
    value: number;
    onChangeEvent: ((value: number) => void);
}

export const DateTimeField: React.FC<IProps> = (props) => {
    const {
        label,
        value,
        type,
        onChangeEvent,
        ...rest
    } = props;
    const {setAndBubbleState} = useEventState(value, onChangeEvent);

    return (
        <TextField
            fullWidth
            {...rest}
            type={type}
            label={label}
            value={(new Date(value)).toISOString().slice(0, 16)}
            onChange={(event) => {
                setAndBubbleState(+new Date(event.target.value));
            }}
        />
    );
};

export default DateTimeField;
