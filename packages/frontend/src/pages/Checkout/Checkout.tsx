import React, {useState} from 'react';
import {Hidden, Stepper, Step, StepButton, Typography, Button, Container, Divider} from '@material-ui/core';
import {AuxInfo} from './AuxInfo';
import {Col, Row} from 'pages/Base/Grid';
import {useStorage} from 'auxiliary/useStorage';
import {OrderInfo} from './OrderInfo';
import {EmalInfo} from './EmailInfo';
import {useStore} from 'pages/Data/Wrapper';
import {CheckoutEmpty} from './CheckoutEmpty';

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
    const {current: {cart}} = useStore();
    const cartItems = cart().local;

    const [info, setInfo] = useStorage<Record<string, any>>('checkout', {});
    const [activeStep, setActiveStep] = React.useState(0);

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
                    <EmalInfo meta={info} />
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
        Object.keys(cartItems).length === 0
            ? <CheckoutEmpty />
            : (<Container maxWidth="sm">
                <Col fullWidth s={16}>
                    {stepper()}
                    {panels()}
                </Col>
            </Container>
            )
    )
}