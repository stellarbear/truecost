import CloseIcon from '@material-ui/icons/Close';
import {IconButton, FormHelperText, TextField} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';
import * as React from 'react';
import {FieldError} from 'react-hook-form';

interface Props {
    style?: React.CSSProperties;
    error?: FieldError;
    value?: string;
    label: string;
    onChange: (...event: any[]) => void;
    noDiscard?: boolean;
}

export const ControllerNumber =
    (props: Props) => {
        const {
            label,
            error,
            style = {},
            value, onChange,
            noDiscard = false,
        } = props;

        return (
            <Col style={style} fullWidth>
                <Row fullWidth
                    align="center"
                    s={noDiscard ? undefined : 8}>
                    <TextField
                        fullWidth
                        type="number"
                        value={value}
                        onChange={(e) => onChange(+e.target.value)}
                        label={label}
                        error={!!error?.message}
                        variant="filled"
                    />
                    {
                        (!noDiscard && (
                            <IconButton
                                onClick={() => onChange("")}
                            >
                                <CloseIcon />
                            </IconButton>
                        ))
                    }
                </Row >
                <FormHelperText error>{error?.message || " "}</FormHelperText>
            </Col >
        );
    };
