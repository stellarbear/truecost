import {Chip, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme} from "@material-ui/core";
import * as React from "react";
import {SelectProps} from "@material-ui/core/Select";

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
        },
    },
};
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        outer: {
            width: "100%",
        },
        inner: {
            display: "flex",
            flexWrap: "wrap",
        },
        chip: {
            margin: "2px",
        },
    }),
);

interface ISelectFieldProps extends SelectProps {
    values: any[];
    label?: string;
    multiple?: boolean;
    baseValue?: any;
    preRenderMap?: Record<string, any>;
    onChangeEvent: (value: any) => void;
}

const SelectField: React.FC<ISelectFieldProps> = ({
                                                      label,
                                                      values,
                                                      onChangeEvent,
                                                      multiple = false,
                                                      baseValue = undefined,
                                                      preRenderMap = values.reduce((val, cur) => ({
                                                          ...cur,
                                                          [val]: val,
                                                      }), {}),
                                                      ...rest
                                                  }) => {
    const classes = useStyles();
    const renderMap = {...preRenderMap};

    const onDelete = (item: string) => {
        const {value} = rest;
        if (value != undefined) {
            const newValue = Array.isArray(value) ? value.filter(v => v != item) : null;
            onChangeEvent(newValue);
        }
    };

    const buildChip = (selected: any) => (
        <Chip
            key={selected}
            className={classes.chip}
            label={renderMap[selected]}
            onDelete={
                ((multiple) || (!multiple && baseValue != undefined && baseValue != selected))
                    ? () => onDelete(selected)
                    : undefined}/>
    );

    return (
        <FormControl
            className={classes.outer}>
            {label ? <InputLabel>{label}</InputLabel> : null}
            <Select
                {...rest}
                multiple={multiple}
                MenuProps={MenuProps}
                onChange={(event: React.ChangeEvent<{
                    name?: string | undefined;
                    value: unknown;
                }>) => onChangeEvent(event.target.value)}
                renderValue={(selected: any) => (
                    <div className={classes.inner}>
                        {
                            Array.isArray(selected)
                                ? (selected as any[]).map((selectedValue: any) => buildChip(selectedValue))
                                : buildChip(selected)
                        }
                    </div>
                )}
            >
                {values.map((value: any) => (
                    <MenuItem key={value} value={value}>
                        {renderMap[value]}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default SelectField;
