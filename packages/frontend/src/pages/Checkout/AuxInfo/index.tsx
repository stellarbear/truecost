import React from 'react';
import {Col} from 'pages/Base/Grid';
import {AuxPlatform, validatePlatform} from './AuxPlatform';
import {AuxField} from './AuxField';
import {AuxTime, validateTime, validateTimeZone} from './AuxTime';

interface IProps {
    value: Record<string, any>;
    setValue: (key: string, value: any) => void;
}

export const AuxInfo: React.FC<IProps> = ({
                                              value,
                                              setValue,
                                          }) => {
    const text = value.text || "";
    const cross = !!value.cross;
    const time = validateTime(value.time);
    const platform = validatePlatform(value.platform);
    const timeZone = validateTimeZone(value.zone);

    return (
        <Col fullWidth s={16}>
            <AuxPlatform
                cross={cross}
                platform={platform}
                setCross={(v) => setValue("cross", v)}
                setPlatform={(v) => setValue("platform", v)}
            />
            <AuxTime
                time={time}
                timeZone={timeZone}
                setTimeZone={(v) => setValue("zone", v)}
                setTime={(v) => setValue("time", v)}
            />
            <AuxField
                text={text}
                setText={(v) => setValue("text", v)}
            />
        </Col>
    );
};
