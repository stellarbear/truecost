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
    value: (string | null) | string[];
    onChangeEvent: (value: (string | null) | string[]) => void;
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
            size="small"
            style={{minWidth: 300}}
            multiple={multiple}
            value={state}
            onChange={(_, newValue: any) => setAndBubbleState(newValue)}
            options={Object.keys(options)}
            getOptionLabel={(option: string) => option in options ? options[option] : 'Any'}
            fullWidth
            renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
    );
};

export default Select;
