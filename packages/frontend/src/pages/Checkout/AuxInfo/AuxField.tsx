import * as React from 'react';
import {Col} from 'pages/Base/Grid';
import {InputField} from 'components/generic/components/InputField';
import {Paper, Typography} from '@material-ui/core';

interface IProps {
    text: string;
    setText: (value: string) => void;
}

export const AuxField: React.FC<IProps> = ({text, setText}) => (
    <Paper elevation={3}>
        <Col p={8}>
            <Typography variant="caption">Any additional information</Typography>
            <InputField
                placeholder="Playable time is... Main character type is... Etc."
                editable={true}
                multiline={true}
                rowsMax={4}
                label={"Info"}
                value={text}
                onChangeEvent={(v) => setText(v.slice(0, 128))} />
        </Col>
    </Paper>
);
