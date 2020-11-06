import React from 'react';
import {Container, NoSsr} from '@material-ui/core';
import {AuxInfo} from './AuxInfo';
import {Col} from 'pages/Base/Grid';
import {useStorage} from 'auxiliary/useStorage';
import {OrderInfo} from './OrderInfo';
import {EmalInfo} from './EmailInfo';
import {Meta} from 'pages/Base/Meta';
import {useStore} from 'pages/Data/Wrapper';


export const Checkout: React.FC = () => {
    const {current: {game}} = useStore();

    const [info, setInfo] = useStorage<Record<string, any>>('checkout', {
        cross: false,
        platform: [],
        text: "",
    });

    const updateInfo = (key: string, value: any) => {
        info[key] = value;  //  dirty hack
        setInfo({...info, [key]: value});
    };

    const panels = () => (
        <Col s={16}>
            <OrderInfo />
            <AuxInfo value={info} setValue={(k: string, v: any) => updateInfo(k, v)} />
            <EmalInfo info={info} />
        </Col>
    );


    return (
        <>
            <Meta entity={game} />
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
