import * as React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {Typography, Select, MenuItem, TextField, Card, CardContent, Paper} from '@material-ui/core';
import {sequence} from 'auxiliary/sequence';
import {Autocomplete} from '@material-ui/lab';
import {tz} from './tz';

export type IClock = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type IAmPm = "am" | "pm"
export type ITime = [IClock, IAmPm, IClock, IAmPm];

const defaultTimeZone = (): [number, string] => {
    const offset = new Date().getTimezoneOffset();
    const possibilities = tz.list.filter(e => e[0] === offset);

    if (possibilities.length > 0) {
        return possibilities[0]
    } else {
        return tz.list[188]
    }
}

export const validateTimeZone = (value: any): [number, string] => {
    if (!Array.isArray(value) || value.length != 2) {
        return defaultTimeZone()
    } else {
        const possibilities = tz.list.filter(e => e[1] === value[1]);
        if (possibilities.length > 0) {
            return possibilities[0]
        } else {
            return defaultTimeZone()
        }
    }
}

const defaultTime: ITime = [12, "am", 12, "pm"];
export const validateTime = (value: any): ITime => {
    if (!Array.isArray(value) || value.length != 4) {
        return defaultTime;
    }

    return value as ITime;
}

interface IProps {
    time: ITime
    timeZone: [number, string]
    setTime: (v: ITime) => void
    setTimeZone: (v: [number, string]) => void
}

export const AuxTime: React.FC<IProps> = ({time, setTime, timeZone, setTimeZone}) => {
    const b = time;
    const seq = sequence(12, t => t + 1);

    return (
        <Paper elevation={3}>
            <Col left fullWidth s={8} p={8} >
                <Typography variant="caption" >Select your main play time</Typography>
                <Row start s={16} wrap>
                    <Row s={8}>
                        <Select
                            value={time[0]}
                            onChange={({target: {value: v}}: any) =>
                                setTime([v, b[1], b[2], b[3]])}
                        >
                            {seq.map(t => <MenuItem key={t} value={t}>{`${t < 10 ? `0${t}` : t}:00`}</MenuItem>)}
                        </Select>
                        <Select
                            value={time[1]}
                            onChange={({target: {value: v}}: any) =>
                                setTime([b[0], v, b[2], b[3]])}
                        >
                            <MenuItem value={`am`}>am</MenuItem>
                            <MenuItem value={`pm`}>pm</MenuItem>
                        </Select>
                    </Row>
                    <Typography>—</Typography>
                    <Row s={8} >
                        <Select
                            value={time[2]}
                            onChange={({target: {value: v}}: any) =>
                                setTime([b[0], b[1], v, b[3]])}
                        >
                            {seq.map(t => <MenuItem key={t} value={t}>{`${t < 10 ? `0${t}` : t}:00`}</MenuItem>)}
                        </Select>
                        <Select
                            value={time[3]}
                            onChange={({target: {value: v}}: any) =>
                                setTime([b[0], b[1], b[2], v])}
                        >
                            <MenuItem value={`am`}>am</MenuItem>
                            <MenuItem value={`pm`}>pm</MenuItem>
                        </Select>
                    </Row>
                </Row>
                <Autocomplete
                    size={"small"}
                    value={validateTimeZone(timeZone)}
                    options={tz.list}
                    getOptionLabel={o => tz.prefix[o[0]] + " " + o[1]}
                    onChange={(_, v) => v && setTimeZone(v)}
                    renderInput={(params) => <TextField {...params} label="Timezone" variant="filled" />}
                />
            </Col>
        </Paper>
    )
}