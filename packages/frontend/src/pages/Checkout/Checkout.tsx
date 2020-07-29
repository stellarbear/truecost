import React, {useState} from 'react';
import {Hidden, Stepper, Step, StepButton, Typography, Button, Container, Divider} from '@material-ui/core';
import {AuxInfo} from './AuxInfo';
import {Col, Row} from 'pages/Base/Grid';
import {useStorage} from 'auxiliary/useStorage';
import {OrderInfo} from './OrderInfo';

const steps = [{
    title: 'Check your order',
    description: ''
}, {
    title: 'Additional information',
    description: 'optional step'
}, {
    title: 'Provide email and discount',
    description: ''
}];

export const Checkout: React.FC = () => {
    const [info, setInfo] = useStorage<Record<string, any>>('checkout', {});
    const [activeStep, setActiveStep] = React.useState(0);

    const updateInfo = (key: string, value: any) => {
        setInfo({...info, [key]: value})
    }

    const renderPanels = () => (
        <Col fullWidth s={16}>
            <React.Fragment>
                <div style={{display: activeStep !== 0 ? "none" : "block"}}>
                    <OrderInfo value={info} setValue={(v: any) => updateInfo("global", v)}/>
                </div>
                <div style={{display: activeStep !== 1 ? "none" : "block"}}>
                    <AuxInfo value={info} setValue={(k: string, v: any) => updateInfo(k, v)} />
                </div>
                <div style={{display: activeStep !== 2 ? "none" : "block"}}>
                    <div></div>
                </div>
            </React.Fragment>
            {activeStep < 2 && (
                <Row end s={8}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={() => setActiveStep(activeStep - 1)} >
                        Back
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={() => setActiveStep(activeStep + 1)}>
                        Next
                    </Button>
                </Row>
            )}
        </Col>
    )

    const renderStepper = (orientation: "horizontal" | "vertical") => (
        <Stepper
            nonLinear
            style={{padding: 0}}
            activeStep={activeStep}
            orientation={orientation}>
            {steps.map(({title, description}, index) => (
                <Step key={title}>
                    <StepButton onClick={() => setActiveStep(index)} completed={index < activeStep}
                        style={{textAlign: "left"}}>
                        <Typography>{title}</Typography>
                        <Typography variant="caption">{description}</Typography>
                    </StepButton>
                </Step>
            ))}
        </Stepper>
    )

    return (
        <Container maxWidth="xs">
            <Col fullWidth s={16}>
                {renderStepper("vertical")}
                <Divider />
                {renderPanels()}
            </Col>
        </Container>
    )
}