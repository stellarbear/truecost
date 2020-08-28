import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import * as React from "react";
import {SelectProps} from "@material-ui/core/Select";
import {useEventState} from "../../../auxiliary/useEventState";

interface IProps extends SelectProps {
    label?: string;
    base?: any;
    onChangeEvent: (value: any) => void;
}

const undef = -1;

export const BooleanSelectField: React.FC<IProps> = (props) => {
    const {
        label,
        onChangeEvent,
        value = undef,
        ...rest
    } = props;
    const {state, setAndBubbleState} = useEventState(value, onChangeEvent);

    return (
        <FormControl fullWidth>
            {label ? <InputLabel>{label}</InputLabel> : null}
            <Select
                value={(state == undefined ? undef : +(state as boolean))}
                {...rest}
                onChange={(event) => {
                    const {value} = event.target;
                    setAndBubbleState(value == undef
                        ? undefined
                        : !!value);
                }}
            >
                <MenuItem value={undef}>Any</MenuItem>
                <MenuItem value={0}>False</MenuItem>
                <MenuItem value={1}>True</MenuItem>
            </Select>
        </FormControl>
    );
};

export default BooleanSelectField;
