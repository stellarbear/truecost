import React, {useState} from 'react';
import {InputField} from 'components';
import {Info} from '@material-ui/icons';
import {Typography} from '@material-ui/core';

interface AuxInfoProps {
    updateInfo: (key: string, value: any) => void;
}

const AuxInfo: React.FC<AuxInfoProps> = ({
                                             updateInfo,
                                         }) => {
    const [info, setInfo] = useState("");
    const [value, setValue] = useState("");

    const renderOrderInfo = () => {
        return (
            <div
                style={{display: "flex", flexDirection: "column", marginTop: 16, marginBottom: 8}}>
                <InputField
                    label="info"
                    value={info}
                    onChangeEvent={(value) => {
                        setInfo(value);
                        updateInfo("info", value);
                    }}
                    adornment={<Info/>}/>
                <Typography variant="caption" style={{textAlign: "right"}}>You may specify any additional information
                    you want.</Typography>
                <Typography variant="caption" style={{textAlign: "right"}}>Please, do NOT paste your account credentials
                    here.</Typography>
            </div>
        );
    };

    return (
        <React.Fragment>
            {renderOrderInfo()}
        </React.Fragment>
    );
};

export default AuxInfo;
