import React from 'react';
import {Col} from 'pages/Base/Grid';
import {AuxPlatform, validatePlatform} from './AuxPlatform';
import {AuxField} from './AuxField';

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
        <Col s={16}>
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
    );
};
