import React from 'react';
import {Col} from 'pages/Base/Grid';
import {Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {AuxMessenger} from './AuxMessenger';

interface IProps {
    value: Record<string, any>;
    setValue: (key: string, value?: any) => void;
}

export const ContactInfo: React.FC<IProps> = (props) => {
    const {
        value,
        setValue,
    } = props;
    const messenger = value.messenger;
    const id = value.id;

    return (
        <div>
            <Accordion elevation={3} TransitionProps={{unmountOnExit: true}} style={{}}>
                <AccordionSummary
                    expandIcon={<ExpandMore />}>
                    <Col>
                        <Typography >Contact information</Typography>
                        <Typography variant="caption">Specify ways of communication</Typography>
                    </Col>
                </AccordionSummary>
                <AccordionDetails>
                    <Col s={8} fullWidth>
                        <AuxMessenger
                            id={id}
                            messenger={messenger}
                            setId={(v) => setValue("id", v)}
                            setMessenger={(v) => setValue("messenger", v)}
                        />
                    </Col>
                </AccordionDetails>
            </Accordion>
        </div>
    );
};
