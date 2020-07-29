import React, {useState, useEffect} from 'react';
import {InputField} from 'components/generic/components/InputField';
import {Col, Row} from 'pages/Base/Grid';
import {Typography, IconButton, Divider, FormControlLabel, Checkbox, Card, CardContent} from '@material-ui/core';
import {AuxGame, validateGame} from './AuxGame';
import {AuxField} from './AuxField';
import {AuxTime, validateTime, validateTimeZone} from './AuxTime';

interface IProps {
    value: Record<string, any>
    setValue: (key: string, value: any) => void
}

export const AuxInfo: React.FC<IProps> = ({
    value,
    setValue
}) => {
    const info = value.info || "";
    const cross = !!value.cross;
    const time = validateTime(value.time);
    const game = validateGame(value.game);
    const timeZone = validateTimeZone(value.zone);

    return (
        <Col fullWidth s={16}>
            <Card><CardContent>
            <AuxGame
                game={game}
                cross={cross}
                setGame={(v) => setValue("game", v)}
                setCross={(v) => setValue("cross", v)}
            />
            </CardContent></Card>
            <Card><CardContent>
            <AuxTime
                time={time}
                timeZone={timeZone}
                setTimeZone={(v) => setValue("zone", v)}
                setTime={(v) => setValue("time", v)}
            />
            </CardContent></Card>
            <Card><CardContent>
            <AuxField
                info={info}
                setInfo={(v) => setValue("info", v)}
            />
            </CardContent></Card>
        </Col>
    )
}