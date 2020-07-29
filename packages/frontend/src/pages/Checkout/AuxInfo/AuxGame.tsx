import React, {useState, useEffect} from 'react';
import {InputField} from 'components/generic/components/InputField';
import {Col, Row} from 'pages/Base/Grid';
import {Typography, IconButton, Divider, FormControlLabel, Checkbox} from '@material-ui/core';

import Xbox from "mdi-material-ui/MicrosoftXbox";
import Windows from "mdi-material-ui/MicrosoftWindows";
import Playstation from "mdi-material-ui/SonyPlaystation";
import {colors} from 'theme';

const platforms = [{
    icon: <Windows />,
    label: "PC"
}, {
    icon: <Playstation />,
    label: "PlayStation"
}, {
    icon: <Xbox />,
    label: "XBOX"
},]
const platformLables = platforms.map(p => p.label);
export const validateGame = (value: any) => Array.isArray(value) ? value.filter(v => platformLables.includes(v)) : [];

interface IProps {
    game: string[]
    setGame: (value: string[]) => void
    cross: boolean
    setCross: (Value: boolean) => void
}

export const AuxGame: React.FC<IProps> = (props) => {
    const {game, cross,
        setGame, setCross} = props;

    const onGameClick = (label: string) => {
        const filtered = game.filter(p => p !== label);
        setGame(filtered.length === game.length
            ? [...filtered, label] : filtered)
    }

    return (
        <Col left fullWidth>
            <Typography variant="caption" >Choose platform</Typography>
            <Row between wrap>
                <Row>
                    {platforms.map(({icon, label}) => (
                        <Col key={label}>
                            <IconButton onClick={() => onGameClick(label)}>
                                {React.cloneElement(icon, {
                                    style: {
                                        color: game.includes(label) ? colors.accentColor : "black",
                                        transition: "all 0.2s linear",
                                        transform: "scale(1.5)",
                                        cursor: "pointer",
                                    }
                                })}
                            </IconButton>
                            <Typography variant="caption">{label}</Typography>
                        </Col>
                    ))}
                </Row>
                <FormControlLabel
                    control={<Checkbox checked={cross} onChange={() => setCross(!cross)} />}
                    label="Crossave"
                />
            </Row>
        </Col>
    )
}