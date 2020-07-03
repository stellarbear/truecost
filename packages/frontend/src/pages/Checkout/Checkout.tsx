import React, {useState} from 'react';
import {Button, Step, StepButton, Stepper, Typography} from '@material-ui/core';
import OrderInfo from './OrderInfo';
import AuxInfo from './AuxInfo';
import EmailInfo from './EmailInfo';
import Meta from 'pages/Base/Meta';

interface CheckoutProps {
}

const Checkout: React.FC<CheckoutProps> = ({}) => {
    const [info, setInfo] = useState<Record<string, any>>({});
    const [activeStep, setActiveStep] = React.useState(0);

    const updateInfo = (key: string, value: any) => {
        setInfo({...info, [key]: value});
    };

    const steps = [{
        title: 'Check your order',
        description: '',
    }, {
        title: 'Additional information',
        description: 'optional step',
    }, {
        title: 'Provide email and discount',
        description: '',
    }];

    const renderPanels = () => (
        <div>
            <div style={{marginTop: 16}}>
                <React.Fragment>
                    <div style={{display: activeStep !== 0 ? "none" : "block"}}>
                        <OrderInfo/>
                    </div>
                    <div style={{display: activeStep !== 1 ? "none" : "block"}}>
                        <AuxInfo updateInfo={updateInfo}/>
                    </div>
                    <div style={{display: activeStep !== 2 ? "none" : "block"}}>
                        <EmailInfo info={info}/>
                    </div>
                </React.Fragment>
            </div>
            {activeStep < 2 && (
                <div style={{display: "flex", justifyContent: "flex-end", marginTop: 16}}>
                    <Button disabled={activeStep === 0} onClick={() => setActiveStep(activeStep - 1)}>Back</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setActiveStep(activeStep + 1)}

                    >Next </Button>
                </div>
            )}
        </div>
    );

    const renderStepper = (orientation: "horizontal" | "vertical") => (
        <Stepper
            nonLinear
            activeStep={activeStep}
            orientation={orientation}
            style={{display: "flex", flexWrap: "wrap"}}>
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
    );

    return (
        <div style={{
            margin: 10,
            display: "flex",
            justifyContent: "center",
        }}>
            <Meta page="checkout"/>
            <div style={{
                width: 500,
                maxWidth: 500,
            }}>
                {renderStepper("vertical")}
                {renderPanels()}
            </div>
        </div>
    );
};

export default Checkout;
