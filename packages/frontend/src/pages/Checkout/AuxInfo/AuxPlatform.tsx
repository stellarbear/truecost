import React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {Checkbox, FormControlLabel, IconButton, Paper, Typography} from '@material-ui/core';

import Xbox from "mdi-material-ui/MicrosoftXbox";
import Windows from "mdi-material-ui/MicrosoftWindows";
import Playstation from "mdi-material-ui/SonyPlaystation";
import {colors} from 'theme';

const platforms = [{
    icon: <Windows />,
    label: "PC",
}, {
    icon: <Playstation />,
    label: "PlayStation",
}, {
    icon: <Xbox />,
    label: "XBOX",
}];
const platformLables = platforms.map(p => p.label);
export const validatePlatform = (value: any) =>
    Array.isArray(value)
        ? value.filter(v => platformLables.includes(v))
        : [];

interface IProps {
    platform: string[];
    setPlatform: (value: string[]) => void;
    cross: boolean;
    setCross: (Value: boolean) => void;
}

export const AuxPlatform: React.FC<IProps> = (props) => {
    const {
        platform, cross,
        setPlatform, setCross,
    } = props;

    const onPlatformClick = (label: string) => {
        if (cross) {
            const filtered = platform.filter(p => p !== label);
            if (filtered.length > 0) {
                setPlatform(filtered.length === platform.length
                    ? [...filtered, label] : filtered);
            }
        } else {
            setPlatform([label]);
        }
    };

    const onCrossClick = () => {
        if (cross && platform.length > 1) {
            setPlatform([platform.pop() || "PC"]);
        }

        setCross(!cross);
    };

    return (
        <Col s={8}>
            <Row justify="space-between" wrap>
                <Row s={8}>
                    {platforms.map(({icon, label}) => (
                        <Col key={label} align="center">
                            <IconButton onClick={() => onPlatformClick(label)}>
                                {React.cloneElement(icon, {
                                    style: {
                                        color: platform.includes(label) ? colors.accentColor : "black",
                                        transition: "all 0.2s linear",
                                        transform: "scale(1.5)",
                                        cursor: "pointer",
                                    },
                                })}
                            </IconButton>
                            <Typography variant="caption">{label}</Typography>
                        </Col>
                    ))}
                </Row>
                <FormControlLabel
                    control={<Checkbox checked={cross} onChange={() => onCrossClick()} />}
                    label="Cross save"
                />
            </Row>
        </Col>
    );
};
