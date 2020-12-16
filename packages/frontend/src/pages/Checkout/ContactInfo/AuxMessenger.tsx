import React from 'react';
import {Col, Row} from 'pages/Base/Grid';
import {IconButton, Typography} from '@material-ui/core';
import Discord from "mdi-material-ui/Discord";
import Skype from "mdi-material-ui/Skype";
import Facebook from "@material-ui/icons/Facebook";
import Telegram from "@material-ui/icons/Telegram";
import WhatsApp from "@material-ui/icons/WhatsApp";
import {colors} from 'theme';
import {InputField} from 'components/generic/components/InputField';

const messengers = [{
    icon: <Telegram />,
    label: "Telegram",
}, {
    icon: <WhatsApp />,
    label: "WhatsApp",
}, {
    icon: <Facebook />,
    label: "Facebook",
}, {
    icon: <Discord />,
    label: "Discord",
}, {
    icon: <Skype />,
    label: "Skype",
}];
interface IProps {
    messenger: string;
    setMessenger: (value?: string) => void;
    id: string;
    setId: (value?: string) => void;
}

export const AuxMessenger: React.FC<IProps> = (props) => {
    const {
        messenger, id,
        setMessenger, setId,
    } = props;

    return (
        <Col s={8}>
            <Row s={8} wrap>
                {messengers.map(({icon, label}) => (
                    <Col key={label} align="center">
                        <IconButton onClick={() => {
                            if (messenger === label) {
                                setMessenger(undefined);
                            } else {
                                setMessenger(label);
                            }
                        }}>
                            {React.cloneElement(icon, {
                                style: {
                                    color: messenger === label ? colors.accentColor : "black",
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
            <Col>
                <InputField
                    editable={true}
                    label={"Messenger profile id"}
                    value={id}
                    onChangeEvent={(v) => setId(v.slice(0, 128))} />
                <Typography variant="caption">If not specified, we will contact you by email</Typography>
            </Col>
        </Col >
    );
};
