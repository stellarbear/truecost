import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import {InputField} from 'components/generic/components/InputField';
import {Typography, Paper} from '@material-ui/core';

interface IProps {
    info: string
    setInfo: (value: string) => void
}

export const AuxField: React.FC<IProps> = ({info, setInfo}) => (
    <Col fullWidth right>
        <Paper elevation={3}>
            <Col fullWidth p={8}>
                <Typography variant="caption" >Any additional information</Typography>
                <InputField
                    editable={true}
                    multiline={true}
                    rowsMax={4}
                    label={"Info"}
                    value={info}
                    onChangeEvent={(v) => setInfo(v)} />
            </Col>
        </Paper>
    </Col>
)