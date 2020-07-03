import {Checkbox, FormControlLabel} from "@material-ui/core";
import {CheckboxProps} from "@material-ui/core/Checkbox";
import React from "react";

interface ICheckBoxFieldProps extends CheckboxProps {
    label?: string;
    rtl?: boolean;
    onChangeEvent: ((value: boolean) => void);
}

const CheckBoxField: React.FC<ICheckBoxFieldProps> = ({
                                                          label,
                                                          rtl = false,
                                                          onChangeEvent,
                                                          ...rest
                                                      }) => {

    return (
        <FormControlLabel
            value={rtl ? "start" : "end"}
            control={
                <Checkbox
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        onChangeEvent(event.target.checked)}
                    {...rest} />
            }
            label={label ? label : ""}
        />
    );
};

export default CheckBoxField;
