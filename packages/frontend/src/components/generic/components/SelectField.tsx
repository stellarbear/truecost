import {Chip, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme, TextField} from "@material-ui/core";
import * as React from "react";
import {SelectProps} from "@material-ui/core/Select";
import {useEventState} from "../useEventState";
import {Autocomplete} from "@material-ui/lab";

export type IOption = Record<string, string>

interface IProps extends SelectProps {
    multiple: boolean
    options: IOption
    label?: string;
    value: string | string[];
    onChangeEvent: (value: string | string[]) => void;
}

export const SelectField: React.FC<IProps> = (props) => {
    const {
        label,
        multiple = false,
        onChangeEvent,
        options,
        value,
        ...rest
    } = props;
    const {state, setAndBubbleState} = useEventState(value, onChangeEvent);

    return (
        <Autocomplete
            multiple={multiple}
            value={state}
            onChange={(_, newValue: any) => {
                setAndBubbleState(newValue.id);
            }}
            options={Object.keys(options)}
            getOptionLabel={(option: string) => options[option]}
            fullWidth
            renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
    );
};

export default Select;
