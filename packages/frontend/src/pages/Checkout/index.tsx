import React from 'react';
import {Container, NoSsr, Typography} from '@material-ui/core';
import {AuxInfo} from './AuxInfo';
import {Col} from 'pages/Base/Grid';
import {useStorage} from 'auxiliary/useStorage';
import {OrderInfo} from './OrderInfo';
import {EmalInfo} from './EmailInfo';
import {Meta} from 'pages/Base/Meta';
import {useStore} from 'pages/Data/Wrapper';
import {ContactInfo} from './ContactInfo';


export const Checkout: React.FC = () => {
    const {current: {game}} = useStore();

    const [info, setInfo] = useStorage<Record<string, any>>('checkout', {
        cross: false,
        platform: [],
        text: "",
    });

    const updateInfo = (key: string, value: any) => {
        if (value !== undefined) {
            info[key] = value;  //  dirty hack
            setInfo({...info, [key]: value});
        } else {
            delete info[key];  //  dirty hack
            setInfo({...info});
        }
    };

    const panels = () => (
        <Col s={16}>
            <OrderInfo />
            {/* <Col s={8}>
                <Typography variant="caption">Information</Typography>
                <AuxInfo
                    value={info}
                    setValue={(k: string, v: any) => updateInfo(k, v)} />
                <ContactInfo
                    value={info}
                    setValue={(k: string, v: any) => updateInfo(k, v)} />

            </Col> */}
            <EmalInfo info={info} />
        </Col>
    );


    return (
        <>
            <Meta entity={game} noIndex/>
            <NoSsr>
                <Container maxWidth="sm" style={{padding: 0}}>
                    <Col fullWidth s={16}>
                        {panels()}
                    </Col>
                </Container>
            </NoSsr>
        </>
    );
};
