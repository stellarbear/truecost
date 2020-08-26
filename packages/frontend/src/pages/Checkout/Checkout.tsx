import React, {useState} from 'react';
import {Hidden, Stepper, Step, StepButton, Typography, Button, Container, Divider} from '@material-ui/core';
import {AuxInfo} from './AuxInfo';
import {Col, Row} from 'pages/Base/Grid';
import {useStorage} from 'auxiliary/useStorage';
import {OrderInfo} from './OrderInfo';
import {EmalInfo} from './EmailInfo';
import {useStore} from 'pages/Data/Wrapper';
import {CheckoutEmpty} from './CheckoutEmpty';
import {useParams, useHistory} from 'react-router-dom';

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
    const {step} = useParams();
    const history = useHistory();

    const [info, setInfo] = useStorage<Record<string, any>>('checkout', {
        cross: false,
        platform: [],
        time: [12, "am", 12, "pm"],
        text: ""
    });
    const [activeStep, setActiveSteppp] = React.useState(Math.min(Math.max((+step || 0), 0), 2));

    const setActiveStep = (step: number) => {
        step = Math.min(Math.max((+step || 0), 0), 2);

        const path = history.location.pathname;
        history.push(path.slice(-2, -1) === "/"
            ? path.slice(0, -1) + step
            : path + "/" + step
        )

    }

    const updateInfo = (key: string, value: any) => {
        info[key] = value;  //  dirty hack
        setInfo({...info, [key]: value})
    }

    const panels = () => (
        <Col fullWidth s={16}>
            <React.Fragment>
                <div style={{display: activeStep !== 0 ? "none" : "block"}}>
                    <OrderInfo />
                </div>
                <div style={{display: activeStep !== 1 ? "none" : "block"}}>
                    <AuxInfo value={info} setValue={(k: string, v: any) => updateInfo(k, v)} />
                </div>
                <div style={{display: activeStep !== 2 ? "none" : "block"}}>
                    <EmalInfo info={info} />
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

    const stepper = () => (
        <Stepper
            nonLinear
            style={{padding: 0}}
            activeStep={activeStep}
            orientation={"vertical"}>
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
        <Container maxWidth="sm" style={{padding: 0}}>
            <Col fullWidth s={16}>
                {stepper()}
                {panels()}
            </Col>
        </Container>
    )
}