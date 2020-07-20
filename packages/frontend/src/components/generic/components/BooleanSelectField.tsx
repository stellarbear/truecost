import {Chip, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme} from "@material-ui/core";
import * as React from "react";
import {SelectProps} from "@material-ui/core/Select";
import {useEventState} from "../useEventState";

interface IProps extends SelectProps {
    label?: string;
    base?: any;
    onChangeEvent: (value: any) => void;
}

export const BooleanSelectField: React.FC<IProps> = ({
    label,
    onChangeEvent,
    base,
    value,
    ...rest
}) => {
    const {state, setAndBubbleState} = useEventState(value, onChangeEvent);

    return (
        <FormControl fullWidth>
            {label ? <InputLabel>{label}</InputLabel> : null}
            <Select
                value={(state == undefined ? -1 : +(state as boolean))}
                {...rest}
                onChange={(event) => {
                    const {value} = event.target;
                    setAndBubbleState(value == -1
                        ? undefined
                        : !!value)
                }}
            >
                <MenuItem value={-1}>Any</MenuItem>
                <MenuItem value={0}>False</MenuItem>
                <MenuItem value={1}>True</MenuItem>
            </Select>
        </FormControl>
    );
};

export default BooleanSelectField;
