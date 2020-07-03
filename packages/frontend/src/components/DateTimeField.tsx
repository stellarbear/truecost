import React from "react";
import {DateTimePicker, DateTimePickerProps} from "@material-ui/pickers";

interface IDateTimeFieldProps extends Partial<DateTimePickerProps> {
    onChangeEvent: ((value: number | null) => void);
    label: string;
    value: string;
}

const DateTimeField = ({
                           label,
                           value,
                           onChangeEvent,
                           ...rest
                       }: IDateTimeFieldProps): JSX.Element => {

    return (
        <DateTimePicker
            {...rest}
            variant="inline"
            label={label}
            value={value}
            onChange={(date) => {
                onChangeEvent(+new Date(date!.toISOString()));
            }}
        />
    );
};

export default DateTimeField;
