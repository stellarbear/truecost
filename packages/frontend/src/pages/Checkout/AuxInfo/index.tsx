import React from 'react';
import {Col} from 'pages/Base/Grid';
import {AuxPlatform, validatePlatform} from './AuxPlatform';
import {AuxField} from './AuxField';
import {Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';

interface IProps {
    value: Record<string, any>;
    setValue: (key: string, value: any) => void;
}

export const AuxInfo: React.FC<IProps> = (props) => {
    const {
        value,
        setValue,
    } = props;
    const text = value.text || "";
    const cross = !!value.cross;
    const platform = validatePlatform(value.platform);

    return (
        <Col s={8}>
            <Typography variant="caption">Information</Typography>
            <div>
                <Accordion elevation={3} TransitionProps={{unmountOnExit: true}} style={{}}>
                    <AccordionSummary
                        expandIcon={<ExpandMore />}>
                        <Col>
                            <Typography >Order information</Typography>
                            <Typography variant="caption">Select platform, and give us details</Typography>
                        </Col>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Col s={8} fullWidth>
                            <AuxPlatform
                                cross={cross}
                                platform={platform}
                                setCross={(v) => setValue("cross", v)}
                                setPlatform={(v) => setValue("platform", v)}
                            />
                            <AuxField
                                text={text}
                                setText={(v) => setValue("text", v)}
                            />
                        </Col>
                    </AccordionDetails>
                </Accordion>
            </div>
        </Col>
    );
};
