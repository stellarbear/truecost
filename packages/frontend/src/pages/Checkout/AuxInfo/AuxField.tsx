import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import {InputField} from 'components/generic/components/InputField';
import {Typography, Paper} from '@material-ui/core';

interface IProps {
    text: string
    setText: (value: string) => void
}

export const AuxField: React.FC<IProps> = ({text, setText}) => (
    <Col fullWidth right>
        <Paper elevation={3}>
            <Col fullWidth p={8}>
                <Typography variant="caption" >Any additional information</Typography>
                <InputField
                    editable={true}
                    multiline={true}
                    rowsMax={4}
                    label={"Info"}
                    value={text}
                    onChangeEvent={(v) => setText(v)} />
            </Col>
        </Paper>
    </Col>
)