import React, {useEffect, useState} from "react";
import {createStyles, FormGroup, makeStyles, Switch, Theme, Typography} from "@material-ui/core";
import {SwitchProps} from "@material-ui/core/Switch";
import {Row} from "pages/Base/Grid";
import {useEventState} from "../useEventState";
import {CSSProperties} from "@material-ui/core/styles/withStyles";

interface IProps extends SwitchProps {
    prefix: string;
    suffix: string;
    value: boolean;
    onChangeEvent: ((value: boolean) => void);
}

const getOpacity = (flag: boolean) => flag ? 1.0 : 0.4;
const style: CSSProperties = {userSelect: "none", cursor: "pointer"}

export const SwitchField: React.FC<IProps> = (props) => {
    const {value, prefix, suffix, onChangeEvent, ...rest} = props;
    const {state, setAndBubbleState} = useEventState(value, onChangeEvent);

    return (
        <Row>
            <Typography
                noWrap
                style={{...style, opacity: getOpacity(!state)}}
                onClick={() => setAndBubbleState(false)}>{prefix}</Typography>
            <Switch
                {...rest}
                checked={state}
                onChange={(_, value) => setAndBubbleState(value)}
            />
            <Typography
                noWrap
                style={{...style, opacity: getOpacity(state)}}
                onClick={() => setAndBubbleState(true)}>{suffix}</Typography>
        </Row>
    );
};

export default SwitchField;
