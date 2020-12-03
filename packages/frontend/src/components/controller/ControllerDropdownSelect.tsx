import CloseIcon from '@material-ui/icons/Close';
import {FormControl, InputLabel, Select, MenuItem, IconButton, FormHelperText} from '@material-ui/core';
import {Col, Row} from 'pages/Base/Grid';
import * as React from 'react';
import {FieldError} from 'react-hook-form';

interface IDataShape<K> {
    id: K;
    name: string;
}

interface Props<K, T> {
    style?: React.CSSProperties;
    error?: FieldError;
    data: T[];
    value?: K;
    label: string;
    noValue?: string;
    readOnly?: boolean;
    onChange: (...event: any[]) => void;
    noDiscard?: boolean;
}

export const ControllerDropdownSelect =
    <K extends string | number, T extends IDataShape<K>>
        (props: Props<K, T>) => {
        const {
            label,
            error,
            style = {},
            data, value, onChange,
            noValue = "Not selected",
            noDiscard = false,
            readOnly = false,
        } = props;

        return (
            <Col style={style} fullWidth>
                <Row fullWidth
                    align="center"
                    s={noDiscard ? undefined : 8}>
                    <FormControl fullWidth error={!!error}>
                        <InputLabel
                            style={{
                                marginLeft: 12,
                                marginTop: value ? 8 : 0,
                            }}>
                            {label}
                        </InputLabel>
                        <Select
                            disabled={readOnly}
                            value={value || ""}
                            variant="filled"
                            onChange={(e) => onChange(e.target.value)}
                        >
                            <MenuItem value="">
                                <em>{noValue}</em>
                            </MenuItem>
                            {data.map(({id, name}, index) => (
                                <MenuItem key={index} value={id}>
                                    {`${name} (${id})`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                <FormHelperText>{error?.message || " "}</FormHelperText>
            </Col >
        );
    };
