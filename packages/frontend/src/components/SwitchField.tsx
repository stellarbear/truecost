import React, {useEffect, useState} from "react";
import {createStyles, FormGroup, makeStyles, Switch, Theme, Typography} from "@material-ui/core";
import {SwitchProps} from "@material-ui/core/Switch";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        outer: {
            marginBottom: 8,
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
        },
        labelEnabled: {
            whiteSpace: "nowrap",
            cursor: "pointer",
            opacity: 1.0,
            padding: 8,
        },
        labelDisabled: {
            whiteSpace: "nowrap",
            cursor: "pointer",
            opacity: 0.4,
            padding: 8,
        },
    }),
);

interface ISwitchFieldProps extends SwitchProps {
    prefix: string;
    suffix: string;
    value: boolean;
    onChangeEvent: ((value: boolean) => void);
}

const SwitchField = ({
                         value,
                         prefix,
                         suffix,
                         onChangeEvent,
                         ...rest
                     }: ISwitchFieldProps): JSX.Element => {
    const classes = useStyles();
    const [state, setState] = useState(value);

    useEffect(() => setState(value), [value]);

    const setChecked = (checked: boolean) => {
        setState(checked);
        onChangeEvent(checked);
    };

    const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) =>
        setChecked(checked);

    return (
        <FormGroup row className={classes.outer}>
            <Typography
                className={state ? classes.labelDisabled : classes.labelEnabled}
                onClick={() => setChecked(false)}>{prefix}</Typography>
            <Switch
                {...rest}
                checked={state}
                onChange={onSwitchChange}
            />
            <Typography
                className={!state ? classes.labelDisabled : classes.labelEnabled}
                onClick={() => setChecked(true)}>{suffix}</Typography>
        </FormGroup>
    );
};

export default SwitchField;
